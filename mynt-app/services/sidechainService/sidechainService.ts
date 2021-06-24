import { codec, cryptography } from '@liskhq/lisk-client';
import CreateUserTokenAssetSchema from './schemas/CreateUserTokenAssetSchema';
import DestroyUserTokensAssetSchema from './schemas/DestroyUserTokensAssetSchema';
import TransferUserTokensAssetSchema from './schemas/TransferUserTokensAssetSchema';
import { createSignedTransaction } from './sidechainTransactionUtil';
import MyntSidechainAccountData from './types/MyntSidechainAccountData';
import MyntSidechainAllUserTokensData from './types/MyntSidechainAllUserTokensData';
import MyntSidechainCreateUserTokenParams from './types/MyntSidechainCreateUserTokenParams';
import MyntSidechainDestroyUserTokenParams from './types/MyntSidechainDestroyUserTokenParams';
import MyntSidechainNodeData from './types/MyntSidechainNodeData';
import MyntSidechainTransferUserTokenParams from './types/MyntSidechainTransferUserTokenParams';
import MyntTransactionParams from './types/MyntTransactionParams';

type HttpRequestParams = {
  endpoint: string;
  httpMethod?: string;
  body?: any;
  headers?: any;
};

type HttpResponseWithData<T> = {
  data: T;
};

async function makeRequestForData<DataType>(
  params: HttpRequestParams
): Promise<DataType> {
  const response = await makeHttpJsonRequest<HttpResponseWithData<DataType>>(
    params
  );
  return response.data;
}

async function makeHttpJsonRequest<ResponseType>(
  params: HttpRequestParams
): Promise<ResponseType> {
  const { endpoint, httpMethod, body, headers } = params;

  const hasJsonRequestBody = body != null;

  const requestBody = hasJsonRequestBody ? JSON.stringify(body) : undefined;
  const additionalHeaders = hasJsonRequestBody
    ? {
        'Content-Type': 'application/json',
      }
    : {};

  const response = await fetch(endpoint, {
    method: httpMethod ?? 'GET',
    headers: { ...headers, ...additionalHeaders },
    body: requestBody,
  });

  return response.json();
}

interface UserTokenAssetType {
  assetId: number;
  assetSchema: codec.Schema;
}

const UserTokenAssets: Record<
  'create' | 'transfer' | 'destroy',
  UserTokenAssetType
> = {
  create: {
    assetId: 0,
    assetSchema: CreateUserTokenAssetSchema,
  },
  transfer: {
    assetId: 1,
    assetSchema: TransferUserTokensAssetSchema,
  },
  destroy: {
    assetId: 2,
    assetSchema: DestroyUserTokensAssetSchema,
  },
};

export default class SidechainService {
  private readonly sidechainHttpApiBaseEndpoint = 'http://localhost:4000/api';
  private readonly sidechainUserTokenApiBaseEndpoint =
    'http://localhost:4001/api';

  async getAccountInfo(binaryAddress: string) {
    return makeRequestForData<MyntSidechainAccountData>({
      endpoint:
        this.sidechainHttpApiBaseEndpoint + '/accounts/' + binaryAddress,
    });
  }

  async getUserToken(symbol: string) {
    const allUserTokens = await this.getAllUserTokens();
    const userToken = allUserTokens.userTokens.find(
      (token) => token.symbol === symbol
    );

    if (!userToken) {
      throw Error('User token with symbol not found ' + symbol);
    }

    return userToken;
  }

  async getAllUserTokens() {
    return makeRequestForData<MyntSidechainAllUserTokensData>({
      endpoint: this.sidechainUserTokenApiBaseEndpoint + '/user-tokens',
    });
  }

  async createUserToken(
    userTokenParams: MyntTransactionParams<MyntSidechainCreateUserTokenParams>
  ) {
    return this.executeTransaction(userTokenParams, UserTokenAssets.create);
  }

  async transferUserToken(
    transferTokenParams: MyntTransactionParams<MyntSidechainTransferUserTokenParams>
  ) {
    const transactionParams = {
      passphrase: transferTokenParams.passphrase,
      symbol: transferTokenParams.symbol,
      amount: transferTokenParams.amount,
      shouldDestroy: transferTokenParams.shouldDestroy,
      recipientAddress: Buffer.from(
        transferTokenParams.recipientAddress,
        'hex'
      ),
    };
    return this.executeTransaction(transactionParams, UserTokenAssets.transfer);
  }

  async destroyUserToken(
    destroyTokenParams: MyntTransactionParams<MyntSidechainDestroyUserTokenParams>
  ) {
    return this.executeTransaction(destroyTokenParams, UserTokenAssets.destroy);
  }

  async getNodeInfo() {
    return makeRequestForData<MyntSidechainNodeData>({
      endpoint: this.sidechainHttpApiBaseEndpoint + '/node/info',
    });
  }

  private async executeTransaction(
    transactionParams: MyntTransactionParams<unknown>,
    assetType: UserTokenAssetType
  ) {
    const { passphrase, ...assetData } = transactionParams;

    const { publicKey } =
      cryptography.getPrivateAndPublicKeyFromPassphrase(passphrase);
    const address = cryptography
      .getAddressFromPassphrase(passphrase)
      .toString('hex');

    const nodeInfo = await this.getNodeInfo();
    const accountInfo = await this.getAccountInfo(address);

    const signedTransaction = createSignedTransaction({
      passphrase,
      publicKey,
      nonce: accountInfo.sequence.nonce,
      nodeNetworkIdentifier: nodeInfo.networkIdentifier,
      assetData: assetData,
      assetSchema: assetType.assetSchema,
      assetId: assetType.assetId,
    });

    const transactionResponse = await makeHttpJsonRequest<
      Record<string, unknown>
    >({
      endpoint: this.sidechainHttpApiBaseEndpoint + '/transactions',
      httpMethod: 'POST',
      body: signedTransaction,
    });

    console.log('Executed transaction with result', transactionResponse);

    if (
      transactionResponse.errors &&
      (transactionResponse.errors as unknown[]).length > 0
    ) {
      throw Error('Transaction execution returned errors');
    }

    return transactionResponse;
  }
}
