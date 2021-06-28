import LiskUserToken from '../../../../mynt-sidechain/src/app/modules/UserTokens/types/LiskUserToken';
import UserTokenBalance from '../../../../mynt-sidechain/src/app/modules/UserTokens/types/UserTokenBalance';

type UserTokenWalletData = LiskUserToken &
  UserTokenBalance & {
    createdByUser: boolean;
    hasTokenSale: boolean;
    hasTokenRedemptions: boolean;
  };

export default UserTokenWalletData;
