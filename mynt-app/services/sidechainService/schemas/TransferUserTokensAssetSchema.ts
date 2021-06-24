import { codec } from '@liskhq/lisk-client';
import { LISK_APP_PREFIX } from '../../../../mynt-sidechain/src/app/util/constants';

const TransferUserTokensAssetSchema: codec.Schema = {
  // Unique identifier of the schema throughout the system
  $id: `${LISK_APP_PREFIX}/user-token/transfer`,
  // Root type must be type object
  type: 'object',
  // Required properties
  required: ['symbol', 'amount', 'recipientAddress'],
  // Properties for the object
  properties: {
    symbol: {
      dataType: 'string',
      fieldNumber: 1,
    },
    amount: {
      dataType: 'uint32',
      fieldNumber: 2,
    },
    recipientAddress: {
      dataType: 'bytes',
      fieldNumber: 3,
    },
    shouldDestroy: {
      dataType: 'boolean',
      fieldNumber: 4,
    },
  },
};

export default TransferUserTokensAssetSchema;
