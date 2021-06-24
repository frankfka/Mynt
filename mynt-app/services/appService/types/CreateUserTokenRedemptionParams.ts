import DatabaseTokenRedemption from '../../database/types/DatabaseTokenRedemption';

type CreateUserTokenRedemptionParams = Omit<DatabaseTokenRedemption, 'id'>;

export default CreateUserTokenRedemptionParams;
