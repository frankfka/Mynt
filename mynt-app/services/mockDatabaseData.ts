type UserID = string;
type TokenSymbol = string;

interface User {
  id: UserID;
  name: string;
  email: string;

  // Optionals - if we need more stuff to render
  profileDescription: string;

  // Rapyd Data
  rapyd: {
    eWalletId: string; // Used to get eWallet accounts
    // For rapydCollect (buying other tokens)
    collect: {
      customerId: string; // Can be used to get payment methods
      paymentMethods: CardPaymentMethod[];
    };
    // For payouts
    disburse: {
      beneficiaries: Record<string, BankBeneficiary>; // Keyed by beneficiary ID (only support banks)
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
  activeTokenSales: Symbol[];

  // Token Redemptions
  activeTokenRedemptions: Record<string, string[]>; // Symbol to list of redemption IDs
}

interface CardPaymentMethod {
  id: string;
  image: string;
  last4: string;
  expirationYear: string;
  expirationMonth: string;
}

interface BankBeneficiary {
  id: string;
  country: 'US';
  currency: 'USD';
  entityType: 'individual';
  accountNumber: string;
  defaultPayoutMethodType: 'us_general_bank';
}

interface Cost {
  amount: number;
  currency: 'USD';
}

interface TokenSale {
  symbol: string; // This is the ID - can only have one sale per symbol
  parentUserId: UserID;
  unitCost: Cost;
  availableQuantity: number; // Remaining available quantity
  description: string;
}

type TokenRedemptionID = string;

interface TokenRedemption {
  id: TokenRedemptionID; // Can have multiple redemptions per symbol
  parentUserId: UserID;
  title: string;
  description: string;
  symbol: string;
  unitCost: number; // In terms of the symbol (must be less than available supply!)
  availableQuantity: number; // Remaining qty
}

interface DatabaseSchema {
  users: Record<UserID, User>;
  tokenSales: Record<TokenSymbol, TokenSale>;
  tokenRedemptions: Record<TokenRedemptionID, TokenRedemption>;
}

interface RapydSender {
  id: string;
  country: 'US';
  entityType: 'company';
  companyName: string;
  currency: 'USD';
  identificationType: string;
  identificationValue: string;
}

interface GlobalData {
  rapyd: {
    sender: RapydSender; // = RapydMintSender
  };
}

export const mockGlobalData: GlobalData = {
  rapyd: {
    sender: {
      id: 'sender_86a24e01fd3b993e5d714d6caf3b59ad',
      country: 'US',
      entityType: 'company',
      companyName: 'Mynt',
      currency: 'USD',
      identificationType: 'company_registered_number',
      identificationValue: '0123456789',
    },
  },
};

export const mockDatabaseData: DatabaseSchema = {
  // Users
  users: {
    // Frank Jia
    'c815cb53-5097-42f4-8b27-31b1d7a76614': {
      id: 'c815cb53-5097-42f4-8b27-31b1d7a76614',
      name: 'Frank Jia',
      email: 'jiafrank98@gmail.com',
      profileDescription: '',

      rapyd: {
        eWalletId: 'ewallet_68abae90037a6768f64ce4389675d576',
        collect: {
          customerId: 'cus_a9afcf0ffd1cd7020d2650df9514397c',
          paymentMethods: [
            {
              id: 'card_b117254f3b59ac02c35f0ec43d14eaab',
              image: 'https://iconslib.rapyd.net/checkout/us_visa_card.png',
              last4: '1111',
              expirationYear: '22',
              expirationMonth: '12',
            },
            {
              id: 'card_84de4c1ac7b70d8d6daf2411e6d69f19',
              image:
                'https://iconslib.rapyd.net/checkout/us_mastercard_card.png',
              last4: '1111',
              expirationYear: '22',
              expirationMonth: '12',
            },
          ],
        },
        disburse: {
          beneficiaries: {
            beneficiary_6726ae3b4205931db1efbb1443d176fe: {
              id: 'beneficiary_6726ae3b4205931db1efbb1443d176fe',
              country: 'US',
              currency: 'USD',
              entityType: 'individual',
              accountNumber: '1234567890',
              defaultPayoutMethodType: 'us_general_bank',
            },
          },
        },
      },

      sidechain: {
        passphrase:
          'belt code famous bounce window sun alert file sphere school bless barrel',
        privateKey:
          'a82b91a88f3030463087abc88112360b8cfcdaf8746d57268d9533976d612ad6a85559e4d8098e0f1eef330ae0f3eb64934382d3350864d7e59c0d3f3fd60832',
        publicKey:
          'a85559e4d8098e0f1eef330ae0f3eb64934382d3350864d7e59c0d3f3fd60832',
        binaryAddress: '5b00192dc29049d449334454f66e8aaebc3ef990',
        address: 'lsk5ozxr57vrxph3r4t3y68osk6qdfchfouhnd6gb',
      },

      activeTokenSales: [],

      activeTokenRedemptions: {},
    },
    // Isabella Funa
    'b7a1ce44-408d-4145-be74-7de58a0ee500': {
      id: 'b7a1ce44-408d-4145-be74-7de58a0ee500',
      name: 'Isabella Funa',
      email: 'isabellafuna@gmail.com',
      profileDescription: '',

      rapyd: {
        eWalletId: 'ewallet_68abae90037a6768f64ce4389675d576',
        collect: {
          customerId: 'cus_a9afcf0ffd1cd7020d2650df9514397c',
          paymentMethods: [
            {
              id: 'card_a3b443d6c3896e6ec692a0239a54ffbd',
              image: 'https://iconslib.rapyd.net/checkout/us_visa_card.png',
              last4: '1111',
              expirationYear: '22',
              expirationMonth: '12',
            },
            {
              id: 'card_bde6ce1138f9631a2cdd9c18d07b2a0c',
              image:
                'https://iconslib.rapyd.net/checkout/us_mastercard_card.png',
              last4: '1111',
              expirationYear: '25',
              expirationMonth: '09',
            },
          ],
        },
        disburse: {
          beneficiaries: {
            beneficiary_6726ae3b4205931db1efbb1443d176fe: {
              id: 'beneficiary_e345992937ae9e4d6a25896383e03895',
              country: 'US',
              currency: 'USD',
              entityType: 'individual',
              accountNumber: '1234567890',
              defaultPayoutMethodType: 'us_general_bank',
            },
          },
        },
      },

      sidechain: {
        passphrase:
          'project horror mansion truck trust express execute report pony veteran swift cherry',
        privateKey:
          '95dd1dacc95098b54e481ad4116e5c1a8c394b1971782e8682067920fa38c9a56a0056090d13ef1b3d5b2a52b41b50b7f76ec5f72e3c43f437c3773dac78c34c',
        publicKey:
          '6a0056090d13ef1b3d5b2a52b41b50b7f76ec5f72e3c43f437c3773dac78c34c',
        address: 'lskqfyrgaydqt5ekst7fsywbuxukozhuqnaswevmr',
        binaryAddress: 'afa32fe63aacd76a6e6ef6e3734030a301d854f9',
      },

      activeTokenSales: [],

      activeTokenRedemptions: {},
    },
  },
  // Token Sales
  tokenSales: {},
  // Token redemptions
  tokenRedemptions: {},
};
