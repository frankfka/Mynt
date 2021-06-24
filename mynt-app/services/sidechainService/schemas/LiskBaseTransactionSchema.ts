import { codec } from '@liskhq/lisk-client';
import { objects } from '@liskhq/lisk-utils';

export const LiskBaseTransactionSchema: codec.Schema = {
  $id: 'lisk/base-transaction',
  type: 'object',
  required: ['moduleID', 'assetID', 'nonce', 'fee', 'senderPublicKey', 'asset'],
  properties: {
    moduleID: {
      dataType: 'uint32',
      fieldNumber: 1,
    },
    assetID: {
      dataType: 'uint32',
      fieldNumber: 2,
    },
    nonce: {
      dataType: 'uint64',
      fieldNumber: 3,
    },
    fee: {
      dataType: 'uint64',
      fieldNumber: 4,
    },
    senderPublicKey: {
      dataType: 'bytes',
      fieldNumber: 5,
    },
    asset: {
      dataType: 'bytes',
      fieldNumber: 6,
    },
    signatures: {
      type: 'array',
      items: {
        dataType: 'bytes',
      },
      fieldNumber: 7,
    },
  },
};

// Merges the base schema with the schema of the transaction asset
export const getTransactionAssetSchema = (
  assetSchema: codec.Schema
): codec.Schema => {
  return objects.mergeDeep({}, LiskBaseTransactionSchema, {
    properties: { asset: assetSchema },
  }) as codec.Schema;
};
