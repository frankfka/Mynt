import AppService from './appService/appService';
import DatabaseService from './database/databaseService';
import RapydApiService from './rapydService/rapydApiService';
import SidechainService from './sidechainService/sidechainService';

export const sidechainService = new SidechainService();

export const rapydService = new RapydApiService();

export const databaseService = new DatabaseService();

export const appService = new AppService(
  sidechainService,
  databaseService,
  rapydService
);

export default appService;
