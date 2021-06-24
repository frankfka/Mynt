import { codec } from '@liskhq/lisk-client';
import { ALL_USER_TOKENS_KEY } from '../../../../mynt-sidechain/src/app/modules/UserTokens/util/constants';
import { LISK_APP_PREFIX } from '../../../../mynt-sidechain/src/app/util/constants';

const AllUserTokensSchema: codec.Schema = {
  $id: `${LISK_APP_PREFIX}/user-tokens/all`,
  type: 'object',
  required: [ALL_USER_TOKENS_KEY],
  properties: {
    [ALL_USER_TOKENS_KEY]: {
      type: 'array',
      fieldNumber: 1,
      items: {
        type: 'object',
        required: ['symbol', 'creatorAddress', 'name', 'circulatingSupply'],
        properties: {
          symbol: {
            dataType: 'string',
            fieldNumber: 1,
          },
          creatorAddress: {
            dataType: 'bytes',
            fieldNumber: 2,
          },
          name: {
            dataType: 'string',
            fieldNumber: 3,
          },
          circulatingSupply: {
            dataType: 'uint32',
            fieldNumber: 4,
          },
        },
      },
    },
  },
};

export default AllUserTokensSchema;
