/* global BigInt */

import { transactions, codec, cryptography } from '@liskhq/lisk-client';
import { getTransactionAssetSchema } from './schemas/LiskBaseTransactionSchema';

export interface CreateSignedTransactionParams {
  passphrase: string;
  publicKey: Buffer;
  nonce: string;
  nodeNetworkIdentifier: string;
  assetData: unknown;
  assetSchema: codec.Schema;
  assetId: number;
}

export const createSignedTransaction = (
  params: CreateSignedTransactionParams
): Record<string, unknown> => {
  const { id, ...transactionInfo } = transactions.signTransaction(
    params.assetSchema,
    {
      moduleID: 1024, // Module ID for UserTokenModule
      assetID: params.assetId,
      nonce: BigInt(params.nonce),
      fee: BigInt(0),
      senderPublicKey: params.publicKey,
      asset: params.assetData,
    },
    Buffer.from(params.nodeNetworkIdentifier, 'hex'),
    params.passphrase
  );

  return codec.codec.toJSON(
    getTransactionAssetSchema(params.assetSchema),
    transactionInfo
  );
};
