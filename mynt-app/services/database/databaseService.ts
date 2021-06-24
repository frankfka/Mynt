import { JSONFile, Low } from 'lowdb';
import { mockDatabaseData, mockGlobalData } from './mockDatabaseData';
import { pull } from 'lodash';
import { DatabaseSchema, GlobalData } from './types/DatabaseSchema';
import DatabaseTokenRedemption from './types/DatabaseTokenRedemption';
import DatabaseTokenSale from './types/DatabaseTokenSale';
import DatabaseUser from './types/DatabaseUser';

type DatabaseState = 'ready' | 'initializing' | 'initialized';

// Essentially a mock database
export default class DatabaseService {
  private readonly globalData: GlobalData;

  private currentState: DatabaseState = 'ready';
  private readonly db: Low<DatabaseSchema>;

  constructor() {
    this.globalData = mockGlobalData;

    // Use demo data - in reality, we would establish a connection to a remote DB
    this.db = new Low<DatabaseSchema>(new JSONFile('local-mock-db.json'));
    this.init();
  }

  private async init() {
    if (this.currentState != 'ready') {
      return;
    }

    await this.db.read();
    if (this.db.data != null) {
      console.log('Skipping initialization as DB already has data');
      this.currentState = 'initialized';
      return;
    }

    console.log('Recreating DB with mock data');

    this.currentState = 'initializing';
    this.db.data = mockDatabaseData;
    await this.db.write();
    this.currentState = 'initialized';
  }

  async getUserData(userId: string): Promise<DatabaseUser | undefined> {
    await this.init();

    return this.db.data?.users[userId];
  }

  async saveTokenSale(tokenSale: DatabaseTokenSale) {
    await this.init();

    // Save to user object
    const activeTokenSalesForUser =
      this.db.data!.users[tokenSale.parentUserId].activeTokenSales;
    pull(activeTokenSalesForUser, tokenSale.symbol); // Remove if currently exists
    activeTokenSalesForUser.push(tokenSale.symbol);

    // Save to tokenSales object
    this.db.data!.tokenSales[tokenSale.symbol] = tokenSale;

    await this.db.write();
  }

  async getTokenSale(symbol: string): Promise<DatabaseTokenSale | undefined> {
    await this.init();

    return this.db.data?.tokenSales[symbol];
  }

  async saveTokenRedemption(tokenRedemption: DatabaseTokenRedemption) {
    await this.init();

    // Save to user
    const userTokenRedemptionsForSymbol =
      this.db.data!.users[tokenRedemption.parentUserId].activeTokenRedemptions[
        tokenRedemption.symbol
      ] || [];

    pull(userTokenRedemptionsForSymbol, tokenRedemption.id); // Remove if currently exists
    userTokenRedemptionsForSymbol.push(tokenRedemption.id);

    this.db.data!.users[tokenRedemption.parentUserId].activeTokenRedemptions[
      tokenRedemption.symbol
    ] = userTokenRedemptionsForSymbol;

    // Save to redemptions
    this.db.data!.tokenRedemptions[tokenRedemption.id] = tokenRedemption;

    await this.db.write();
  }

  async getTokenRedemption(
    id: string
  ): Promise<DatabaseTokenRedemption | undefined> {
    await this.init();

    return this.db.data?.tokenRedemptions[id];
  }
}
