import { USER_TOKENS_MODULE_NAME } from '../util/constants';
import UserTokenBalance from './UserTokenBalance';

// Describes the additional account schema declared in UserTokensModuleSchema
export default interface UserTokensModuleAccount {
  [USER_TOKENS_MODULE_NAME]: {
    createdUserTokenSymbols: string[];
    userTokenBalances: UserTokenBalance[];
  };
}
