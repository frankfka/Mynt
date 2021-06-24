export type RapydWalletAccount = {
  accountId: string;
  currency: string;
  balance: number;
};

export type RapydWallet = {
  walletId: string;
  accounts: RapydWalletAccount[];
};
