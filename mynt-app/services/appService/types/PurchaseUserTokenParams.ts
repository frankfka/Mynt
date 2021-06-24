import { RapydPaymentMethod } from '../../rapydService/types/RapydPaymentMethod';

export default interface PurchaseUserTokenParams {
  buyerUserId: string;
  paymentMethod: Omit<RapydPaymentMethod, 'image'>;
  symbol: string; // Identifies the token sale
  amount: number;
}
