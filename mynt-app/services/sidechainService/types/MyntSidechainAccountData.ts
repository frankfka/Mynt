import UserTokenBalance from '../../../../mynt-sidechain/src/app/modules/UserTokens/types/UserTokenBalance';

export interface MyntSidechainAccountUserTokensModuleData {
  createdUserTokenSymbols: string[];
  userTokenBalances: UserTokenBalance[];
}

export default interface MyntSidechainAccountData {
  address: string;
  sequence: {
    nonce: string;
  };
  userTokensModule: MyntSidechainAccountUserTokensModuleData;
}
