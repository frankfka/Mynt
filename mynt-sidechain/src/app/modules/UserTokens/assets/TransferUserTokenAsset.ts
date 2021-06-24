import { ApplyAssetContext, BaseAsset, ValidateAssetContext } from 'lisk-sdk';
import { find } from 'lodash';
import TransferUserTokensAssetSchema from '../schemas/TransferUserTokensAssetSchema';
import getAllUserTokens from '../stateHandlers/getAllUserTokens';
import setAllUserTokens from '../stateHandlers/setAllUserTokens';
import LiskUserToken from '../types/LiskUserToken';
import TransferUserTokenAssetData from '../types/TransferUserTokenAssetData';
import UserTokenBalance from '../types/UserTokenBalance';
import UserTokensModuleAccount from '../types/UserTokensModuleAccount';
import { USER_TOKENS_MODULE_NAME } from '../util/constants';

export class TransferUserTokenAsset extends BaseAsset {
  public id = 1;
  public name = 'UserTokenTransferAsset';
  public schema = TransferUserTokensAssetSchema;

  public validate(context: ValidateAssetContext<TransferUserTokenAssetData>) {
    const { asset } = context;

    // Verify that asset params are valid
    if (!asset.symbol || asset.amount <= 0) {
      throw new Error(
        `Error validating transfer asset ${JSON.stringify(asset)}`
      );
    }
  }

  public async apply(context: ApplyAssetContext<TransferUserTokenAssetData>) {
    const { asset, stateStore, transaction } = context;

    const { senderAddress } = transaction;

    const userTokenSymbol = asset.symbol;
    const transferAmount = asset.amount;
    const shouldDestroyAsset = asset.shouldDestroy;

    const sender = await stateStore.account.get<UserTokensModuleAccount>(
      senderAddress
    );

    // Find current balance for sender and validate
    const senderTokenBalance = find<UserTokenBalance>(
      sender[USER_TOKENS_MODULE_NAME].userTokenBalances,
      (balance) => balance.symbol === userTokenSymbol
    );

    if (!senderTokenBalance || senderTokenBalance.balance < transferAmount) {
      throw new Error('Sender does not have adequate balance of this token.');
    }

    // Deduct balance for sender (Skipping removing the balance if 0 for now)
    senderTokenBalance.balance -= transferAmount;

    // Save sender
    await stateStore.account.set(senderAddress, sender);

    if (shouldDestroyAsset) {
      // Update circulating balance
      const allTokens = await getAllUserTokens(stateStore);
      const globalToken = find<LiskUserToken>(
        allTokens,
        (token: LiskUserToken) => token.symbol === asset.symbol
      );

      if (!globalToken) {
        throw new Error(
          `The user token ${asset.symbol} somehow does not exist in globals`
        );
      }

      // Save new supply
      globalToken.circulatingSupply -= transferAmount;
      await setAllUserTokens(stateStore, allTokens);

      // Skip debiting balance
      return;
    }

    // Debit balance for recipient, adding to existing balance if it exists
    const { recipientAddress } = asset;
    const recipientAccount = await stateStore.account.get<UserTokensModuleAccount>(
      recipientAddress
    );
    const recipientTokenBalances =
      recipientAccount[USER_TOKENS_MODULE_NAME].userTokenBalances;

    const recipientTokenBalance = find<UserTokenBalance>(
      recipientTokenBalances,
      (balance) => balance.symbol === userTokenSymbol
    );

    if (recipientTokenBalance != null) {
      // Add to existing balance
      recipientTokenBalance.balance += transferAmount;
    } else {
      // No balance yet, so add it
      recipientTokenBalances.push({
        symbol: userTokenSymbol,
        balance: transferAmount,
      });
    }
    // Save recipient
    await stateStore.account.set(recipientAddress, recipientAccount);
  }
}
