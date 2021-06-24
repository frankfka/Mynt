import { RapydPaymentMethod } from './RapydPaymentMethod';

export type RapydCustomer = {
  rapydCustomerId: string;
  name: string;
  email: string;
  paymentMethods: RapydPaymentMethod[];
  rapydWalletId: string;
};
