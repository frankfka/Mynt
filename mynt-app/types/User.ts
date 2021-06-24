import DatabaseUser from '../services/database/types/DatabaseUser';
import { RapydWallet } from '../services/rapydService/types/RapydWallet';
import { MyntSidechainAccountUserTokensModuleData } from '../services/sidechainService/types/MyntSidechainAccountData';

export default interface User {
  dbData: DatabaseUser;
  sidechainData: MyntSidechainAccountUserTokensModuleData;
  rapydData: {
    wallet: RapydWallet;
  };
}
