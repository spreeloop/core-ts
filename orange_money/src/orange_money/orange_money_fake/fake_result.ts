import { OrangePaymentStatus } from '../../constants';
import {
  MobilePaymentInitializationResponse,
  PaymentInitializationResponse,
} from '../../utils/requests_responses';

export const mobileInitializationSuccess: MobilePaymentInitializationResponse =
  {
    status: OrangePaymentStatus.PENDING_PAYMENT,
    payToken: 'MP220806C74C8F5787A9C4F79AED',
  };

export const webInitializationSuccess: PaymentInitializationResponse = {
  status: OrangePaymentStatus.INITIATE_PAYMENT,
  payToken: 'MP220806C74C8F5787A9C4F79AED',
  paymentUrl: 'https://send.com/test',
};

export const webCheckPaymentSuccess: OrangePaymentStatus =
  OrangePaymentStatus.SUCCESS_WEB_PAYMENT;

export const mobileCheckPaymentSuccess: OrangePaymentStatus =
  OrangePaymentStatus.SUCCESSFULL_MOBILE_PAYMENT;
