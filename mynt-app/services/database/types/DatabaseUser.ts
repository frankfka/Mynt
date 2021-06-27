import RapydDebitCardBeneficiary from '../../rapydService/types/RapydDebitCardBeneficiary';
import { RapydCardPaymentMethod } from '../../rapydService/types/RapydPaymentMethod';

export default interface DatabaseUser {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  profileImage: string;
  profileDescription: string;

  // Rapyd Data
  rapyd: {
    eWalletId: string; // Used to get eWallet accounts
    // For rapydCollect (buying other tokens)
    collect: {
      customerId: string; // Can be used to get payment methods
      paymentMethods: RapydCardPaymentMethod[];
    };
    // For payouts
    disburse: {
      beneficiaries: Record<string, RapydDebitCardBeneficiary>; // Keyed by beneficiary ID (only support banks)
    };
  };

  // Sidechain Data
  sidechain: {
    passphrase: string;
    privateKey: string;
    publicKey: string;
    binaryAddress: string;
    address: string;
  };

  // Token Sales
  activeTokenSales: string[]; // List of symbols

  // Token Redemptions
  activeTokenRedemptions: Record<string, string[]>; // Symbol to list of redemption IDs
}
