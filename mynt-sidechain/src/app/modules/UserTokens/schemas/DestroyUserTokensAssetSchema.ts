import { Schema } from 'lisk-sdk';
import { LISK_APP_PREFIX } from '../../../util/constants';

const DestroyUserTokensAssetSchema: Schema = {
  // Unique identifier of the schema throughout the system
  $id: `${LISK_APP_PREFIX}/user-token/destroy`,
  // Root type must be type object
  type: 'object',
  // Required properties
  required: ['symbol', 'amount'],
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
  },
};

export default DestroyUserTokensAssetSchema;
