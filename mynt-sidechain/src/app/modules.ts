import { Application, utils } from 'lisk-sdk';
import { UserTokensModule } from './modules/UserTokens/UserTokensModule';
import { USER_TOKENS_MODULE_NAME } from './modules/UserTokens/util/constants';

export const migrateGenesisBlock = (genesisBlock: Record<string, unknown>) => {
  // @ts-expect-error Using dev genesisBlock
  // eslint-disable-next-line
  genesisBlock.header.asset.accounts = genesisBlock.header.asset.accounts.map(
    (account) =>
      utils.objects.mergeDeep({}, account, {
        [USER_TOKENS_MODULE_NAME]: {
          userTokenBalances: [],
          createdUserTokenSymbols: [],
        },
      })
  );
};

export const registerModules = (app: Application): void => {
  app.registerModule(UserTokensModule);
};
