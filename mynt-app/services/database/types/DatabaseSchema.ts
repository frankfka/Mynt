import RapydSender from '../../rapydService/types/RapydSender';
import DatabaseTokenRedemption from './DatabaseTokenRedemption';
import DatabaseTokenSale from './DatabaseTokenSale';
import DatabaseUser from './DatabaseUser';

export interface GlobalData {
  rapyd: {
    sender: RapydSender;
  };
}

export interface DatabaseSchema {
  users: Record<string, DatabaseUser>;
  tokenSales: Record<string, DatabaseTokenSale>; // Symbol to token sale
  tokenRedemptions: Record<string, DatabaseTokenRedemption>; // ID to token redemption
}
