import { codec } from '@liskhq/lisk-client';

const UserTokensModuleSchema: Omit<codec.Schema, '$id'> & {
  default: Record<string, unknown>;
} = {
  // Root type must be type object
  type: 'object',
  // Properties for the object
  properties: {
    createdUserTokenSymbols: {
      type: 'array',
      fieldNumber: 1,
      items: {
        dataType: 'string',
      },
    },
    userTokenBalances: {
      type: 'array',
      fieldNumber: 2,
      items: {
        type: 'object',
        properties: {
          // Symbol for the user token
          symbol: {
            dataType: 'string',
            fieldNumber: 1,
          },
          // How much the account holds in this given symbol
          balance: {
            dataType: 'uint32',
            fieldNumber: 2,
          },
        },
      },
    },
  },
  default: {
    createdUserTokenSymbols: [],
    userTokenBalances: [],
  },
};

export default UserTokensModuleSchema;
