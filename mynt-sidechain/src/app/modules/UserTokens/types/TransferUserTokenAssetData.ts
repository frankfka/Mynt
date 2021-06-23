// Describes data held in TransferUserTokenAsset
export default interface TransferUserTokenAssetData {
  symbol: string;
  recipientAddress: Buffer;
  amount: number;
}
