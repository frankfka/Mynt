import { v4 as uuidv4 } from 'uuid';
import User from '../../types/User';
import DatabaseService from '../database/databaseService';
import RapydApiService from '../rapydService/rapydApiService';
import SidechainService from '../sidechainService/sidechainService';
import CreatePayoutRequestParams from './types/CreatePayoutRequestParams';
import CreateUserTokenParams from './types/CreateUserTokenParams';
import CreateUserTokenRedemptionParams from './types/CreateUserTokenRedemptionParams';
import CreateUserTokenSaleParams from './types/CreateUserTokenSaleParams';
import PurchaseUserTokenParams from './types/PurchaseUserTokenParams';
import RedeemUserTokenParams from './types/RedeemUserTokenParams';

export default class AppService {
  private readonly sidechainService: SidechainService;
  private readonly databaseService: DatabaseService;
  private readonly rapydService: RapydApiService;

  constructor(
    sidechainService: SidechainService,
    databaseService: DatabaseService,
    rapydService: RapydApiService
  ) {
    this.sidechainService = sidechainService;
    this.databaseService = databaseService;
    this.rapydService = rapydService;
  }

  async getUser(userId: string): Promise<User> {
    const dbData = await this.databaseService.getUserData(userId);

    if (!dbData) {
      throw Error('User does not exist');
    }

    // Call sidechainService for wallet balances and created tokens
    const sidechainData = await this.sidechainService.getAccountInfo(
      dbData.sidechain.binaryAddress
    );

    // Call rapydService to get latest eWallet data
    const rapydWalletData = await this.rapydService.retrieveRapydWallet(
      dbData.rapyd.eWalletId
    );

    return {
      dbData,
      sidechainData: sidechainData.userTokensModule,
      rapydData: {
        wallet: rapydWalletData,
      },
    };
  }

  async createUserToken(createTokenParams: CreateUserTokenParams) {
    await this.sidechainService.createUserToken(createTokenParams);
  }

  async getAllUserTokens() {
    return this.sidechainService.getAllUserTokens();
  }

  async getUserToken(symbol: string) {
    return this.sidechainService.getUserToken(symbol);
  }

  async createUserTokenSale(createTokenSaleParams: CreateUserTokenSaleParams) {
    const { parentUserId, availableQuantity, symbol } = createTokenSaleParams;

    const user = await this.getUser(parentUserId);

    if (!user.sidechainData.createdUserTokenSymbols.includes(symbol)) {
      throw Error('User is not the creator of this symbol');
    }

    const currentTokenBalance = user.sidechainData.userTokenBalances.find(
      (balance) => balance.symbol === symbol
    );
    if (
      !currentTokenBalance ||
      currentTokenBalance.balance < availableQuantity
    ) {
      throw Error('User does not have sufficient balance to create a sale');
    }

    // Save token sale
    await this.databaseService.saveTokenSale(createTokenSaleParams);
  }

  async getUserTokenSale(symbol: string) {
    const tokenSale = await this.databaseService.getTokenSale(symbol);
    if (!tokenSale) {
      throw Error('Token sale does not exist for this symbol ' + symbol);
    }
    return tokenSale;
  }

  async purchaseUserToken(purchaseUserTokenParams: PurchaseUserTokenParams) {
    // Get token sale object
    const tokenSale = await this.databaseService.getTokenSale(
      purchaseUserTokenParams.symbol
    );

    const buyer = await this.databaseService.getUserData(
      purchaseUserTokenParams.buyerUserId
    );

    if (!tokenSale || !buyer) {
      throw Error('Invalid parameters for purchasing user token');
    }

    const seller = await this.databaseService.getUserData(
      tokenSale.parentUserId
    );

    if (!seller) {
      throw Error('Seller does not existing for purchasing user token');
    }

    let paymentId: string | undefined;
    const paymentMethod = purchaseUserTokenParams.paymentMethod;
    const paymentAmount =
      purchaseUserTokenParams.amount * tokenSale.unitCost.amount;

    if (paymentMethod.category === 'card') {
      // Create a card payment
      const paymentResponse = await this.rapydService.createPayment(
        paymentMethod.id,
        seller.rapyd.eWalletId,
        paymentAmount,
        'USD'
      );
      paymentId = paymentResponse.paymentId;
    } else {
      // Transfer payment
      const paymentResponse = await this.rapydService.transferWalletFunds(
        paymentMethod.id,
        seller.rapyd.eWalletId,
        paymentAmount,
        'USD'
      );
      paymentId = paymentResponse.paymentId;
    }

    if (!paymentId) {
      throw Error('Payment failed');
    }

    // Transfer tokens
    await this.sidechainService.transferUserToken({
      amount: purchaseUserTokenParams.amount,
      passphrase: seller.sidechain.passphrase,
      recipientAddress: buyer.sidechain.binaryAddress,
      shouldDestroy: false, // Don't destroy for transfers from token creator
      symbol: purchaseUserTokenParams.symbol,
    });

    // Update sale remaining quantity
    tokenSale.availableQuantity -= purchaseUserTokenParams.amount;
    await this.databaseService.saveTokenSale(tokenSale);

    return {
      paymentId,
    };
  }

  async createUserTokenRedemption(
    createRedemptionParams: CreateUserTokenRedemptionParams
  ) {
    const parentUser = await this.getUser(createRedemptionParams.parentUserId);

    if (!parentUser) {
      throw Error('The parent user does not exist');
    }

    if (
      !parentUser.sidechainData.createdUserTokenSymbols.includes(
        createRedemptionParams.symbol
      )
    ) {
      throw Error(
        'The parent user did not create the token, so cannot create a redemption for it'
      );
    }

    // Create unique UUID
    const redemptionId = uuidv4();

    // Save to DB - redemptions object & user object
    await this.databaseService.saveTokenRedemption({
      id: redemptionId,
      ...createRedemptionParams,
    });

    // Return ID
    return { redemptionId };
  }

  async getUserTokenRedemption(redemptionId: string) {
    const tokenRedemption = await this.databaseService.getTokenRedemption(
      redemptionId
    );
    if (!tokenRedemption) {
      throw Error('Redemption does not exist with ID ' + redemptionId);
    }
    return tokenRedemption;
  }

  async redeemUserToken(redemptionParams: RedeemUserTokenParams) {
    // Get user data for address
    const tokenRedemption = await this.databaseService.getTokenRedemption(
      redemptionParams.redemptionId
    );
    const redeemer = await this.getUser(redemptionParams.userId);

    if (!tokenRedemption || !redeemer) {
      throw Error('Invalid params for redeeming user token');
    }

    if (tokenRedemption.availableQuantity < redemptionParams.quantity) {
      throw Error('Not enough available quantity for request');
    }

    // Calculate # of tokens to redeem
    const redemptionAmount =
      redemptionParams.quantity * tokenRedemption.unitCost;

    const tokenCreator = await this.databaseService.getUserData(
      tokenRedemption.parentUserId
    );

    if (!tokenCreator) {
      throw Error('Could not find creator for the token redemption');
    }

    // Call sidechain to redeem & destroy token
    await this.sidechainService.transferUserToken({
      amount: redemptionAmount,
      passphrase: redeemer.dbData.sidechain.passphrase,
      recipientAddress: tokenCreator.sidechain.binaryAddress,
      shouldDestroy: true, // Destroy when redeeming
      symbol: tokenRedemption.symbol,
    });

    // Update redemption available quantity
    tokenRedemption.availableQuantity -= redemptionParams.quantity;
    await this.databaseService.saveTokenRedemption(tokenRedemption);
  }

  async createPayoutRequest(payoutRequestParams: CreatePayoutRequestParams) {
    return this.rapydService.createPayoutRequest({
      amount: payoutRequestParams.cost.amount,
      beneficiaryId: payoutRequestParams.beneficiaryId,
      senderId: this.databaseService.getGlobalData().rapyd.sender.id,
      sourceWalletId: payoutRequestParams.ewalletId,
    });
  }
}
