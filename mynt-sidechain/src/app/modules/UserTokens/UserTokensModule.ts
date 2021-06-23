import { BaseModule } from 'lisk-sdk';
import { CreateUserTokenAsset } from './assets/CreateUserTokenAsset';
import { DestroyUserTokenAsset } from './assets/DestroyUserTokenAsset';
import { TransferUserTokenAsset } from './assets/TransferUserTokenAsset';
import UserTokensModuleSchema from './schemas/UserTokensModuleSchema';
import {
  GET_ALL_USER_TOKENS_ACTION_NAME,
  USER_TOKENS_MODULE_NAME,
} from './util/constants';
import getAllUserTokensJSON from './stateHandlers/getAllUserTokensJSON';

export class UserTokensModule extends BaseModule {
  // Functions that plugins and external services can invoke via the API client
  public actions = {
    [GET_ALL_USER_TOKENS_ACTION_NAME]: async () =>
      getAllUserTokensJSON(this._dataAccess),
  };

  public name = USER_TOKENS_MODULE_NAME;
  public transactionAssets = [
    new CreateUserTokenAsset(),
    new TransferUserTokenAsset(),
    new DestroyUserTokenAsset(),
  ];
  public id = 1024;

  // Set the schema
  public accountSchema = UserTokensModuleSchema;
}
