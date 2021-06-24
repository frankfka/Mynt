export default interface RapydBankBeneficiary {
  id: string;
  country: string;
  currency: string;
  entityType: 'individual';
  accountNumber: string;
  defaultPayoutMethodType: string;
}
