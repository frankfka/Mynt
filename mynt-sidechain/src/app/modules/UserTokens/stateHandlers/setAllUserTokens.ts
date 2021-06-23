import { StateStore, codec } from 'lisk-sdk';
import { sortBy } from 'lodash';
import AllUserTokensSchema from '../schemas/AllUserTokensSchema';
import AllUserTokensData from '../types/AllUserTokensData';
import UserToken from '../types/LiskUserToken';
import { CHAIN_STATE_ALL_USER_TOKENS_KEY } from '../util/constants';

const setAllUserTokens = async (
  stateStore: StateStore,
  newTokens: UserToken[]
) => {
  const newTokensData: AllUserTokensData = {
    allUserTokens: sortBy(newTokens, 'symbol'),
  };

  await stateStore.chain.set(
    CHAIN_STATE_ALL_USER_TOKENS_KEY,
    codec.encode(AllUserTokensSchema, newTokensData)
  );
};

export default setAllUserTokens;
