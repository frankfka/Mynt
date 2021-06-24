import CryptoJS from 'crypto-js';
import { get } from 'lodash';
import {
  parseCreatePaymentResponse,
  parseRapydWalletTransferResponse,
  parseRetrieveCustomerResponse,
  parseRetrieveRapydWalletResponse,
  RapydCreatePaymentResponse,
  RapydRetrieveCustomerResponse,
  RapydWalletTransferResponse,
  RetrieveRapydWalletResponse,
} from './rapydApiResponseParsers';
import RapydDisburseRequestParams from './types/RapydDisburseRequestParams';

export default class RapydApiService {
  private readonly accessKey: string;
  private readonly secretKey: string;
  private readonly rapydEndpoint: string = 'https://sandboxapi.rapyd.net';

  constructor() {
    if (
      process.env.RAPYD_ACCESS_KEY == null ||
      process.env.RAPYD_SECRET_KEY == null
    ) {
      throw Error('Rapyd Env Vars not properly defined');
    }

    this.accessKey = process.env.RAPYD_ACCESS_KEY;
    this.secretKey = process.env.RAPYD_SECRET_KEY;
  }

  // Disburse payout API
  async createPayoutRequest(disburseRequestParams: RapydDisburseRequestParams) {
    const responseJson = await this.post('/v1/payouts', {
      beneficiary: disburseRequestParams.beneficiaryId,
      beneficiary_country: 'US',
      beneficiary_entity_type: 'individual',
      ewallet: disburseRequestParams.sourceWalletId,
      payout_amount: disburseRequestParams.amount,
      payout_currency: 'USD',
      payout_method_type: 'us_general_bank',
      sender: disburseRequestParams.senderId,
      sender_country: 'US',
      sender_currency: 'USD',
      sender_entity_type: 'company',
    });

    return responseJson;
  }

  // Create Payment API
  async createPayment(
    paymentMethodId: string,
    destinationWalletId: string,
    amount: number,
    currency: string
  ): Promise<RapydCreatePaymentResponse> {
    const responseJson = await this.post('/v1/payments', {
      amount,
      currency,
      payment_method: paymentMethodId,
      ewallets: [
        {
          ewallet: destinationWalletId,
          percentage: 100,
        },
      ],
    });
    return parseCreatePaymentResponse(responseJson);
  }

  // eWallet Transfer API
  async transferWalletFunds(
    sourceWalletId: string,
    destinationWalletId: string,
    amount: number,
    currency: string
  ): Promise<RapydWalletTransferResponse> {
    // Create the transfer
    const transferInitResponse = await this.post('/v1/account/transfer', {
      source_ewallet: sourceWalletId,
      amount: amount,
      currency,
      destination_ewallet: destinationWalletId,
    });
    const transferId = get(transferInitResponse, 'data.id');

    if (transferId == null) {
      throw Error(
        'Undefined transfer ID: ' + JSON.stringify(transferInitResponse)
      );
    }

    // Accept the transfer
    const responseJson = await this.post('/v1/account/transfer/response', {
      id: transferId,
      status: 'accept',
    });
    return parseRapydWalletTransferResponse(responseJson);
  }

  // Retrieve Customer API
  async retrieveCustomer(
    rapydCustomerId: string
  ): Promise<RapydRetrieveCustomerResponse> {
    const responseData = await this.get(`/v1/customers/${rapydCustomerId}`);
    return parseRetrieveCustomerResponse(responseData);
  }

  // Retrieve eWallet API
  async retrieveRapydWallet(
    walletId: string
  ): Promise<RetrieveRapydWalletResponse> {
    const responseData = await this.get(`/v1/user/${walletId}`);
    return parseRetrieveRapydWalletResponse(responseData);
  }

  // Calls GET https://sandboxapi.rapyd.net/v1/data/countries for a health check
  async pingRapydApi(): Promise<any> {
    return this.get('/v1/data/countries');
  }

  /**
   * Performs a GET request for the specified endpoint
   */
  private async get(endpoint: string): Promise<any> {
    return this.fetchWithAuth('GET', endpoint);
  }

  /**
   * Performs a POST request for the specified endpoint with the given body object
   */
  private async post(endpoint: string, body?: any): Promise<any> {
    return this.fetchWithAuth('POST', endpoint, body);
  }

  /**
   * Performs a fetch operation to Rapyd API with the relevant headers
   */
  private async fetchWithAuth(
    httpMethod: string,
    endpoint: string,
    body?: any
  ): Promise<any> {
    const requestBody = body != null ? JSON.stringify(body) : undefined;
    const [salt, timestamp, signature] = this.getAuthHeaders(
      httpMethod,
      endpoint,
      requestBody
    );

    const result = await fetch(this.rapydEndpoint + endpoint, {
      method: httpMethod,
      headers: {
        salt,
        timestamp,
        signature,
        access_key: this.accessKey,
      },
      body: requestBody,
    });

    return result.json();
  }

  /**
   * Returns [salt, timestamp, signature]
   */
  private getAuthHeaders(
    httpMethod: string,
    endpoint: string,
    requestBody?: string
  ): [string, string, string] {
    const salt = CryptoJS.lib.WordArray.random(12).toString();
    const timestamp = (Math.floor(new Date().getTime() / 1000) - 10).toString();
    const bodyForSigning = requestBody != null ? requestBody : '';

    const toSign =
      httpMethod.toLowerCase() +
      endpoint +
      salt +
      timestamp +
      this.accessKey +
      this.secretKey +
      bodyForSigning;

    const signature = CryptoJS.enc.Hex.stringify(
      CryptoJS.HmacSHA256(toSign, this.secretKey)
    );

    const stringSignature = CryptoJS.enc.Base64.stringify(
      CryptoJS.enc.Utf8.parse(signature)
    );
    return [salt, timestamp, stringSignature];
  }
}
