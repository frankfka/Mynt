export default interface RapydBankBeneficiary {
  id: string;
  country: 'US';
  name: string;
  currency: 'USD';
  email: string;
  cardExpirationYear: string;
  cardExpirationMonth: string;
  cardNumber: string;
  payoutMethodType: 'us_atmdebit_card';
}
