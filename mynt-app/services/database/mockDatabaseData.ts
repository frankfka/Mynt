import { DatabaseSchema, GlobalData } from './types/DatabaseSchema';

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
      phoneNumber: '7783849871',
      profileImage:
        'https://avatars.githubusercontent.com/u/31530056?s=400&u=9ca43bcabd1ac6462d03d878713c0fe2d5df965e&v=4',
      profileDescription:
        'Hello! I am an aspiring Youtube content creator located in Vancouver, Canada. ' +
        'I specialize in creating content centered around the latest developments in software development ' +
        'and engineering. My videos are short, attention-grabbing, and easily digestible, as opposed to the ' +
        'multi-hour long tutorials that currently exist. These are meant to be "snack"-sized and entertaining. I hope to become the go-to resource ' +
        'for casual learning on Youtube, Tiktok, and other social media platforms.',

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
              category: 'card',
            },
            {
              id: 'card_84de4c1ac7b70d8d6daf2411e6d69f19',
              image:
                'https://iconslib.rapyd.net/checkout/us_mastercard_card.png',
              last4: '1111',
              expirationYear: '22',
              expirationMonth: '12',
              category: 'card',
            },
          ],
        },
        disburse: {
          beneficiaries: {
            beneficiary_62737ccde6730138de719d6bd18e7a20: {
              id: 'beneficiary_62737ccde6730138de719d6bd18e7a20',
              country: 'US',
              name: 'Frank Jia',
              currency: 'USD',
              email: 'jiafrank98@gmail.com',
              cardExpirationYear: '22',
              cardExpirationMonth: '12',
              cardNumber: '1111',
              payoutMethodType: 'us_atmdebit_card',
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
      phoneNumber: '7783849871',
      profileImage:
        'https://avataaars.io/?avatarStyle=Transparent&topType=LongHairStraight&accessoriesType=Blank&hairColor=BrownDark&facialHairType=Blank&clotheType=Hoodie&clotheColor=Gray01&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light',
      profileDescription: '',

      rapyd: {
        eWalletId: 'ewallet_774ca34497f10f4229037726e6e4a1f1',
        collect: {
          customerId: 'cus_a9afcf0ffd1cd7020d2650df9514397c',
          paymentMethods: [
            {
              id: 'card_a3b443d6c3896e6ec692a0239a54ffbd',
              image: 'https://iconslib.rapyd.net/checkout/us_visa_card.png',
              last4: '1111',
              expirationYear: '22',
              expirationMonth: '12',
              category: 'card',
            },
            {
              id: 'card_bde6ce1138f9631a2cdd9c18d07b2a0c',
              image:
                'https://iconslib.rapyd.net/checkout/us_mastercard_card.png',
              last4: '1111',
              expirationYear: '25',
              expirationMonth: '09',
              category: 'card',
            },
          ],
        },
        disburse: {
          beneficiaries: {
            beneficiary_90fab5ae1d4bb26ab9b1a9a42edb4437: {
              id: 'beneficiary_90fab5ae1d4bb26ab9b1a9a42edb4437',
              country: 'US',
              name: 'Isabella Funa',
              currency: 'USD',
              email: 'rapydtest@rapyd.net',
              cardExpirationYear: '23',
              cardExpirationMonth: '05',
              cardNumber: '1111',
              payoutMethodType: 'us_atmdebit_card',
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
