import { Schema } from 'lisk-sdk';
import { LISK_APP_PREFIX } from '../../../util/constants';

const CreateUserTokenAssetSchema: Schema = {
  $id: `${LISK_APP_PREFIX}/user-token/create`,
  type: 'object',
  required: ['name'],
  // Properties for the object
  properties: {
    name: {
      dataType: 'string',
      fieldNumber: 1,
    },
    symbol: {
      dataType: 'string',
      fieldNumber: 2,
    },
    circulatingSupply: {
      dataType: 'uint32',
      fieldNumber: 3,
    },
  },
};

export default CreateUserTokenAssetSchema;
