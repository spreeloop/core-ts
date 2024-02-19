import { LoggerInterface } from '../../utils/logging_interface';
import { OrangeMoneyFunctions } from '../orange_money';
import { MobilePayment } from './mobile_platfom/mobile_platform';

/**
 * Implement the orange money live payment.
 */
export class OrangeMoneyPaymentLive implements OrangeMoneyFunctions {
  /**
   * Constructs a new OrangeMoneyPaymentLive Payment.
   * @param {LoggerInterface} logger - The logger instance. Defaults to a new Logger object.
   * @param {Function} getAccessTokenFromCache - The function to get the access token from cache.
   * @param {Function} updateAccessTokenCache - The function to update the cache access token.
   */
  constructor(
    public readonly logger: LoggerInterface,
    public readonly getAccessTokenFromCache: () => Promise<
      { accessToken: string; expirationTimeInUtc?: string | null } | undefined
    >,
    public readonly updateAccessTokenCache: (
      accessToken: string,
      accessTokenExpirationTimeInUtc: string
    ) => Promise<boolean>
  ) {}

  // Initialization of mobile orange money payment.
  initializeMobilePayment = new MobilePayment(
    this.logger,
    this.getAccessTokenFromCache,
    this.updateAccessTokenCache
  ).initializeMobilePayment;

  // Gets the mobile payment status.
  checkMobilePaymentStatus = new MobilePayment(
    this.logger,
    this.getAccessTokenFromCache,
    this.updateAccessTokenCache
  ).checkMobilePaymentStatus;
}
