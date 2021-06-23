import { ApplyAssetContext, BaseAsset, ValidateAssetContext } from 'lisk-sdk';
import { find } from 'lodash';
import DestroyUserTokensAssetSchema from '../schemas/DestroyUserTokensAssetSchema';
import getAllUserTokens from '../stateHandlers/getAllUserTokens';
import setAllUserTokens from '../stateHandlers/setAllUserTokens';
import DestroyUserTokenAssetData from '../types/DestroyUserTokenAssetData';
import LiskUserToken from '../types/LiskUserToken';
import UserTokenBalance from '../types/UserTokenBalance';
import UserTokensModuleAccount from '../types/UserTokensModuleAccount';
import { USER_TOKENS_MODULE_NAME } from '../util/constants';

export class DestroyUserTokenAsset extends BaseAsset {
  public id = 2;
  public name = 'DestroyUserTokenAsset';
  public schema = DestroyUserTokensAssetSchema;

  public validate(context: ValidateAssetContext<DestroyUserTokenAssetData>) {
    const { asset } = context;

    // Verify that asset params are valid
    if (!asset.symbol || asset.amount <= 0) {
      throw new Error(
        `Error validating destroy token asset ${JSON.stringify(asset)}`
      );
    }
  }

  public async apply(context: ApplyAssetContext<DestroyUserTokenAssetData>) {
    const { asset, stateStore, transaction } = context;

    const { senderAddress } = transaction;

    const userTokenSymbol = asset.symbol;
    const amountToDestroy = asset.amount;

    const sender = await stateStore.account.get<UserTokensModuleAccount>(
      senderAddress
    );

    // Find current balance for sender and validate
    const senderTokenBalance = find<UserTokenBalance>(
      sender[USER_TOKENS_MODULE_NAME].userTokenBalances,
      (balance) => balance.symbol === userTokenSymbol
    );

    if (!senderTokenBalance || senderTokenBalance.balance < amountToDestroy) {
      throw new Error('Sender does not have adequate balance of this token.');
    }

    // Deduct balance for sender (Skipping removing the balance if 0 for now)
    senderTokenBalance.balance -= amountToDestroy;

    // Save sender
    await stateStore.account.set(senderAddress, sender);

    // Update circulating balances
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
    globalToken.circulatingSupply -= amountToDestroy;
    await setAllUserTokens(stateStore, allTokens);
  }
}
