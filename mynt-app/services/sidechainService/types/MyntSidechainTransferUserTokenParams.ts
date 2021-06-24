export default interface MyntSidechainTransferUserTokenParams {
  symbol: string;
  recipientAddress: string;
  amount: number;
  shouldDestroy: boolean;
}
