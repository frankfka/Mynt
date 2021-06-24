import { codec } from '@liskhq/lisk-client';
import { LISK_APP_PREFIX } from '../../../../mynt-sidechain/src/app/util/constants';

const CreateUserTokenAssetSchema: codec.Schema = {
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
