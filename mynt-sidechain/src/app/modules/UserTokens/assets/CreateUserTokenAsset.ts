import { ApplyAssetContext, BaseAsset, ValidateAssetContext } from 'lisk-sdk';
import { find } from 'lodash';

import CreateUserTokenAssetSchema from '../schemas/CreateUserTokenAssetSchema';
import CreateUserTokenAssetData from '../types/CreateUserTokenAssetData';
import LiskUserToken from '../types/LiskUserToken';
import UserTokensModuleAccount from '../types/UserTokensModuleAccount';
import { USER_TOKENS_MODULE_NAME } from '../util/constants';
import getAllUserTokens from '../stateHandlers/getAllUserTokens';
import setAllUserTokens from '../stateHandlers/setAllUserTokens';

export class CreateUserTokenAsset extends BaseAsset<CreateUserTokenAssetData> {
  public id = 0;
  public name = 'CreateUserTokenAsset';
  public schema = CreateUserTokenAssetSchema;

  public validate(context: ValidateAssetContext<CreateUserTokenAssetData>) {
    const { asset } = context;

    // Verify that asset params are valid
    if (!asset.name || !asset.symbol || asset.circulatingSupply <= 0) {
      throw new Error(`Error validating token ${JSON.stringify(asset)}`);
    }
  }

  public async apply(context: ApplyAssetContext<CreateUserTokenAssetData>) {
    const { asset, stateStore, transaction } = context;
    const { senderAddress } = transaction;

    const allTokens = await getAllUserTokens(stateStore);

    // Verify that the symbol does not already exist
    if (
      find(allTokens, (token: LiskUserToken) => token.symbol === asset.symbol)
    ) {
      throw Error(`User token with the symbol ${asset.symbol} already exists.`);
    }

    const senderAccount = await stateStore.account.get<UserTokensModuleAccount>(
      senderAddress
    );

    const newUserToken: LiskUserToken = {
      name: asset.name,
      symbol: asset.symbol,
      circulatingSupply: asset.circulatingSupply,
      creatorAddress: senderAddress,
    };

    // Credit the newly created tokens to the sender account
    senderAccount[USER_TOKENS_MODULE_NAME].userTokenBalances.push({
      symbol: newUserToken.symbol,
      balance: newUserToken.circulatingSupply,
    });

    // Add to array of tokens created by the user
    senderAccount[USER_TOKENS_MODULE_NAME].createdUserTokenSymbols.push(
      newUserToken.symbol
    );

    // Save the account
    await stateStore.account.set(senderAddress, senderAccount);

    // Save all tokens
    allTokens.push(newUserToken);
    await setAllUserTokens(stateStore, allTokens);
  }
}
