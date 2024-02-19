import { Logger } from '@spreeloop-core/logging';
import { OrangeMoneyErrorType, OrangePaymentStatus } from '../../constants';
import { PaymentInitializationResponse } from '../../utils/requests_responses';
import {
  MobileInitializationParams,
  MobileParamsForCheckStatus,
} from '../../utils/resquest_params';
import { mobileCheckPaymentSuccess } from './fake_result';
import { OrangeMoneyPaymentFake } from './orange_money_fake_payment';

const mobileInitiateParams: MobileInitializationParams = {
  amount: 100,
  apiPassword: 'secret',
  apiUserName: 'secret',
  notifUrl: 'https://localhost',
  transactionId: '1',
  pinCode: '123',
  receiverPhoneNumber: '698526541',
  userPhoneNumber: '698526541',
  xAuthToken: 'ABCDEGHIJKLMNOPQRSTUVW',
};
const mobilePaymentParamForCheckStatus: MobileParamsForCheckStatus = {
  mobileOmVersion: 'v3',
  xAuthToken: 'ABCDEGHIJKLMNOPQRSTUVW',
  payToken: 'MP220807558VEF7A9C4F09AED',
  apiUserName: 'secret',
  apiPassword: 'secret',
};
const logger = new Logger();
describe('Test the fake orange money payment', () => {
  const fakePayment = new OrangeMoneyPaymentFake(logger);
  it('Initialize mobile and web payment failed cause: Invalid data provided', async () => {
    const mobileResult = await fakePayment.initializeMobilePayment({
      amount: 0,
      notifUrl: 'https://localhost',
      transactionId: '1',
      apiPassword: '123',
      apiUserName: '123',
      xAuthToken: '',
      userPhoneNumber: '',
      receiverPhoneNumber: '',
      pinCode: '',
    });

    expect(
      'orangeMoneyError' in mobileResult && mobileResult.orangeMoneyError
    ).toEqual(OrangeMoneyErrorType.invalidData);
  });
  it('Initialize mobile and web payment success', async () => {
    const mobileResult = (await fakePayment.initializeMobilePayment(
      mobileInitiateParams
    )) as PaymentInitializationResponse;
    expect(mobileResult.status).toEqual(OrangePaymentStatus.PENDING_PAYMENT);
  });
  it('Check the mobile and web payment success', async () => {
    const mobileResult = await fakePayment.checkMobilePaymentStatus(
      mobilePaymentParamForCheckStatus
    );
    expect('status' in mobileResult && mobileResult.status).toEqual(
      mobileCheckPaymentSuccess
    );
  });
});
