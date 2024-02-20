import Joi from 'joi';
import { DisbursementXTargetEnvironmentType } from '../utils/constants';
import { LoggerInterface } from '../../utils/logging_interface';
import { merchantPhoneNumberRegex } from '../utils/regex';
import { CreateAccessTokenResponse } from '../operations/create_access_token';
import { TransferRequest, TransferResponse } from '../operations/transfer';
import {
  GetTransferStatusRequest,
  GetTransferStatusResponse,
} from '../operations/get_transfer_status';
import { DisbursementLive } from './src/live';
import { DisbursementFake } from './src/sandbox';

/**
 * Interface for DisbursementServiceConfig.
 */
export interface DisbursementServiceConfig {
  clientId: string;
  clientSecret: string;
  customerKey: string;
  customerSecret: string;
  channelUserMsisdn: string;
  pin: string;
  environment: DisbursementXTargetEnvironmentType;
  logger: LoggerInterface;
}

/**
 * Joi schema for DisbursementServiceConfigSchema.
 */
export const DisbursementServiceConfigSchema =
  Joi.object<DisbursementServiceConfig>({
    clientId: Joi.string().required().messages({
      'string.base': '"clientId" should be a type of \'text\'',
      'string.empty': '"clientId" cannot be an empty field',
      'any.required': '"clientId" is a required field',
    }),
    clientSecret: Joi.string().required().messages({
      'string.base': '"clientSecret" should be a type of \'text\'',
      'string.empty': '"clientSecret" cannot be an empty field',
      'any.required': '"clientSecret" is a required field',
    }),
    customerKey: Joi.string().required().messages({
      'string.base': '"customerKey" should be a type of \'text\'',
      'string.empty': '"customerKey" cannot be an empty field',
      'any.required': '"customerKey" is a required field',
    }),
    customerSecret: Joi.string().required().messages({
      'string.base': '"customerSecret" should be a type of \'text\'',
      'string.empty': '"customerSecret" cannot be an empty field',
      'any.required': '"customerSecret" is a required field',
    }),
    channelUserMsisdn: Joi.string()
      .pattern(merchantPhoneNumberRegex)
      .required()
      .messages({
        'string.base': '"channelUserMsisdn" should be a type of \'text\'',
        'string.empty': '"channelUserMsisdn" cannot be an empty field',
        'any.required': '"channelUserMsisdn" is a required field',
      }),
    pin: Joi.string().required().messages({
      'string.base': '"pin" should be a type of \'text\'',
      'string.empty': '"pin" cannot be an empty field',
      'any.required': '"pin" is a required field',
    }),
    environment: Joi.string()
      .valid(...Object.values(DisbursementXTargetEnvironmentType))
      .required()
      .messages({
        'string.base': '"environment" should be a type of \'text\'',
        'string.empty': '"environment" cannot be an empty field',
        'any.required': '"environment" is a required field',
      }),
    logger: Joi.object().required().messages({
      'string.base': '"logger" should be a type of \'object\'',
      'string.empty': '"logger" cannot be an empty field',
      'any.required': '"logger" is a required field',
    }),
  });

/**
 * Orange Money API Disbursement.
 * @class
 */
export interface DisbursementInterface {
  /**
   * Creates an access token.
   *
   * @return {Promise<CreateAccessTokenResponse>} The method response containing a string and a token.
   */
  createAccessToken(): Promise<CreateAccessTokenResponse>;

  /**
   * Transfers the specified amount of money from one account to another.
   *
   * @param {TransferRequest} params - The parameters for the transfer.
   * @return {Promise<TransferResponse>} - The response from the transfer method.
   */
  transfer(params: TransferRequest): Promise<TransferResponse>;

  /**
   * Retrieves the status of a transfer.
   *
   * @param {GetTransferStatusRequest} params - The parameters for retrieving the transfer status.
   * @return {Promise<GetTransferStatusResponse>} - The method response containing the status and transfer status response.
   */
  getTransferStatus(
    params: GetTransferStatusRequest
  ): Promise<GetTransferStatusResponse>;
}

/**
 * Orange Money API Disbursement.
 * @class
 */
export class Disbursement {
  /**
   * Creates a new Disbursement object based on the provided configuration.
   *
   * @param {DisbursementServiceConfig} config - The configuration for the Disbursement object.
   * @return {Disbursement} A new Disbursement object based on the provided configuration.
   */
  static createDisbursement(
    config: DisbursementServiceConfig
  ): DisbursementInterface {
    switch (config.environment) {
      case DisbursementXTargetEnvironmentType.prod:
        return new DisbursementLive(config);
      case DisbursementXTargetEnvironmentType.sandbox:
        return new DisbursementFake(config);
    }
  }
}
