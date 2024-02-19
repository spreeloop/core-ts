import {
  TransferRequest,
  TransferResponse,
  transfer,
} from '../../operations/transfer';
import {
  CreateAccessTokenResponse,
  createAccessToken,
} from '../../operations/create_access_token';
import { Routes } from '../../routes/routes';
import {
  DisbursementInterface,
  DisbursementServiceConfig,
} from '../disbursement_service';
import {
  GetTransferStatusRequest,
  GetTransferStatusResponse,
  getTransferStatus,
} from '../../operations/get_transfer_status';

/**
 * Orange Money API Live Disbursement.
 * @class
 */
export class DisbursementLive implements DisbursementInterface {
  protected readonly config: DisbursementServiceConfig;
  protected readonly routes: Routes;
  /**
   * Constructs a new {Disbursement}.
   * @constructor
   * @param {DisbursementServiceConfig} config - The required global route configuration.
   */
  constructor(config: DisbursementServiceConfig) {
    this.routes = new Routes();
    this.config = config;
  }

  /**
   * Creates an access token.
   *
   * @return {Promise<CreateAccessTokenResponse>} The method response containing a string and a token.
   */
  async createAccessToken(): Promise<CreateAccessTokenResponse> {
    return await createAccessToken({
      configs: this.config,
      endPoint: this.routes.createAccessToken(),
    });
  }

  /**
   * Transfers the specified amount of money from one account to another.
   *
   * @param {TransferRequest} params - The parameters for the transfer.
   * @return {Promise<TransferResponse>} - The response from the transfer method.
   */
  async transfer(params: TransferRequest): Promise<TransferResponse> {
    return await transfer({
      configs: this.config,
      params: params,
      endPoint: this.routes.transfer(),
    });
  }

  /**
   * Retrieves the status of a transfer.
   *
   * @param {GetTransferStatusRequest} params - The parameters for retrieving the transfer status.
   * @return {Promise<GetTransferStatusResponse>} - The method response containing the status and transfer status response.
   */
  async getTransferStatus(
    params: GetTransferStatusRequest
  ): Promise<GetTransferStatusResponse> {
    return await getTransferStatus({
      configs: this.config,
      params: params,
      endPoint: this.routes.transferStatus(params.messageId),
    });
  }
}
