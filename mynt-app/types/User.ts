import DatabaseUser from '../services/database/types/DatabaseUser';
import { MyntSidechainAccountUserTokensModuleData } from '../services/sidechainService/types/MyntSidechainAccountData';

export default interface User {
  dbData: DatabaseUser;
  sidechainData: MyntSidechainAccountUserTokensModuleData;
}
