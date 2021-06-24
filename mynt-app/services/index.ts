import AppService from './appService/appService';
import DatabaseService from './database/databaseService';
import SidechainService from './sidechainService/sidechainService';

export const sidechainService = new SidechainService();

export const databaseService = new DatabaseService();

export const appService = new AppService(sidechainService, databaseService);

export default appService;
