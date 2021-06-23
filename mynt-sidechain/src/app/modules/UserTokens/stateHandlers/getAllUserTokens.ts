import { StateStore, codec } from 'lisk-sdk';
import AllUserTokensSchema from '../schemas/AllUserTokensSchema';
import AllUserTokensData from '../types/AllUserTokensData';
import UserToken from '../types/LiskUserToken';
import { CHAIN_STATE_ALL_USER_TOKENS_KEY } from '../util/constants';

const getAllUserTokens = async (
  stateStore: StateStore
): Promise<UserToken[]> => {
  const allTokensBuffer = await stateStore.chain.get(
    CHAIN_STATE_ALL_USER_TOKENS_KEY
  );

  if (!allTokensBuffer) {
    return [];
  }

  const allUserTokensData = codec.decode<AllUserTokensData>(
    AllUserTokensSchema,
    allTokensBuffer
  );

  return allUserTokensData.allUserTokens;
};

export default getAllUserTokens;
