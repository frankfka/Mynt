export type RapydPaymentMethodCategory = 'ewallet' | 'card'; // Only consider these for now
export type RapydPaymentMethod = {
  id: string;
  category: RapydPaymentMethodCategory;
  image: string;
};

export type RapydCardPaymentMethodData = {
  id: string;
  last4: string;
  expirationYear: string;
  expirationMonth: string;
};

export type RapydCardPaymentMethod = RapydPaymentMethod &
  RapydCardPaymentMethodData & {
    category: 'card';
  };
