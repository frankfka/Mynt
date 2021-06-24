import {
  RapydCardPaymentMethodData,
  RapydPaymentMethod,
} from './models/RapydPaymentMethod';
import { RapydCustomer } from './models/RapydCustomer';
import { RapydWallet, RapydWalletAccount } from './models/RapydWallet';

/**
 * Parsers to extract data from Rapyd API responses into our models
 */

export type RapydCreatePaymentResponse = {
  paymentId: string;
  status: string;
  paymentType: 'standard';
};
export const parseCreatePaymentResponse = (
  responseJson: any
): RapydCreatePaymentResponse => {
  const data = responseJson.data;

  return {
    paymentId: data.id,
    status: data.status,
    paymentType: 'standard',
  };
};

export type RapydWalletTransferResponse = Omit<
  RapydCreatePaymentResponse,
  'paymentType'
> & {
  paymentType: 'rapyd';
};
export const parseRapydWalletTransferResponse = (
  responseJson: any
): RapydWalletTransferResponse => {
  return {
    ...parseCreatePaymentResponse(responseJson),
    paymentType: 'rapyd',
  };
};

export type RapydRetrieveCustomerResponse = RapydCustomer;
export const parseRetrieveCustomerResponse = (
  responseJson: any
): RapydRetrieveCustomerResponse => {
  const data = responseJson.data;

  // Parse payment methods
  const paymentMethods: RapydPaymentMethod[] = data['payment_methods'].data.map(
    (paymentMethodData: any) => {
      const paymentMethod: RapydPaymentMethod = {
        id: paymentMethodData.id,
        type: paymentMethodData.type,
        category: paymentMethodData.category,
        imageUrl: paymentMethodData.image,
      };

      const cardPaymentMethodData: Partial<RapydCardPaymentMethodData> = {};
      if (paymentMethod.category === 'card') {
        cardPaymentMethodData.name = paymentMethodData.name;
        cardPaymentMethodData.lastFourDigits = paymentMethodData.last4;
        cardPaymentMethodData.expYear = paymentMethodData.expiration_year;
        cardPaymentMethodData.expMonth = paymentMethodData.expiration_month;
      }

      return {
        ...paymentMethod,
        ...cardPaymentMethodData,
      };
    }
  );

  return {
    rapydCustomerId: data.id,
    name: data.name,
    paymentMethods,
    email: data.email,
    rapydWalletId: data.ewallet,
  };
};

export type RetrieveRapydWalletResponse = RapydWallet;
export const parseRetrieveRapydWalletResponse = (
  responseJson: any
): RetrieveRapydWalletResponse => {
  const data = responseJson.data;

  // Parse wallet accounts
  const rapydWalletAccounts: RapydWalletAccount[] = data.accounts.map(
    (accountData: any) => {
      return {
        accountId: accountData.id,
        currency: accountData.currency,
        balance: accountData.balance,
      };
    }
  );

  return {
    walletId: data.id,
    accounts: rapydWalletAccounts,
  };
};
