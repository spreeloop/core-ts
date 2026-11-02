
# Welcome to @spreeloop/orange_money 👋

<p>
  <a href="https://www.npmjs.com/package/@spreeloop/orange_money" target="_blank">
    <img alt="Version" src="https://img.shields.io/npm/v/@spreeloop/orange_money.svg">
  </a>
  <a href="#" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
</p>

The Y-note Orange Money Node.js Integration Module is a powerful toolkit
designed to simplify the integration of Orange Money's payment capabilities
into Node.js applications. This module provides developers with a convenient
interface to interact with Orange Money APIs, enabling seamless payment
processing and transaction management.

## Features

- **Easy Integration**: Simplifies the integration of Orange Money payment
 functionality into Node.js applications.
- **Flexible Configuration**: Allows developers to customize payment
configurations based on specific requirements.
- **Comprehensive Documentation**: Provides comprehensive documentation and
 examples for easy integration and usage.
- **Supports Multiple Environments**: Supports multiple target environments,
 including production and testing environments.

## Installation

To install the Orange Money Node.js Integration Module, simply add it to
your Node.js project using npm:

```bash
npm install @spreeloop/orange_money
```

## Configuration

Provide endpoint URLs in the configuration object. For payments, set `baseURL`
to the Orange Money API base URL without an API path; the package adds payment
paths automatically. For disbursements, set `baseURL` to the disbursement API
base URL and `baseURLToken` to the full access-token endpoint URL. Your
application can source these values from its own configuration and change them
without updating this package.

## Run tests

```sh
npm run test
```

## Table content

- [Merchant payment](README.md#merchant-payment)
  1. [Generate access-token](README.md#generate-access-token)
  2. [Generate pay-token](README.md#generate-pay-token)
  3. [Initiate Payment](README.md#initiate-payment)
  4. [Get Orange Money Payment Status](README.md#get-orange-money-payment-status)

- ## Merchant payment

  Before calling any payment function, we need to create the orange money
  Payment instance.

```typescript
import {OrangeMoneyPayment} from  @spreeloop/orange_money;

// Creates payment configuration
const config = {
  /** In test mode use the TargetEnvironment.fake that return static data since
    the y-note payment don't have the sandbox environment.
  */
  targetEnvironment: TargetEnvironment.prod,
  baseURL: 'https://api-s1.orange.cm',
  apiUserName: 'your_api_username',
  apiPassword: 'your_api_password',
  xAuthToken: 'your_x_auth_token',

// By default we use the 'console' to display the log but you can decide to 
// use your own custom log.
  logger: console,
};

const payment = OrangeMoneyPayment.createPayment(config);
```

For disbursements, include the configurable API URLs as well:

```typescript
const disbursementConfig = {
  // Other required disbursement credentials and configuration...
  baseURL: 'https://omapi.ynote.africa',
  baseURLToken: 'https://omapi-token.ynote.africa/oauth2/token',
};
```

- ### Generate access-token

```typescript
const accessTokenResponse = await payment.getAccessToken();
```

- ### Generate pay-token

```typescript
const payTokenResponse = await payment.getPayToken('your_access_token');
```

- ### Initiate Payment

The payment initialization depends on the platform on which the application
runs. This package only support USSD payment.

```typescript
// Initialize Orange Money Payment
const initializationResponse = await payment.initializeOrangeMoneyPayment({
  description: 'Payment for goods',
  subscriberNumber: '696600011',
  channelUserNumber: '696600011',
  transactionId: '1234567890',
  amount: '1000',
  pinCode: '1234',
  notifUrl: 'https://yourdomain.com/payment/notify',
  payToken: 'your_pay_token',
  accessToken: 'your_access_token',
});
```

If you want to receive an answer immediately, always set a correct `notifUrl`
endpoint link. The service notifies the url immediately or 1 minutes after
receiving the client validation.  
The response received is of the form:

```typescript
{
    "payToken": "payToken",
    "status" : "status",
    "message" : "message"
}
```

**Note**: After initiating the payment, the request goes to status
`EXPIRED` if the user doesn't validate or cancel the payment within 7 minutes.

[Express](https://expressjs.com/en/guide/routing.html) is one of the most popular npm
 package to manage your endpoint.

Example:

```typescript
import * as express from 'express';

const app = express();
const expressRouter = express.Router;
const router = expressRouter();

appV1.use('/', router);

router.post('/orange_money/payment/:paymentId', (req, res) => {
  const body = req.body;
  ...
  /** 
   * Your code.......
    Before updating the payment in your system, retrieve the payment status
    by using getOrangeMoneyPaymentStatus function and compare the status 
    received with that sent to your endpoint. This is to ensure the consistency
    of your system.
  */
  ...

  return res.sendStatus(HttpStatusCode.Ok);
});
```

### Get Orange Money Payment Status

```typescript
// Get Orange Money Payment Status
const paymentStatusResponse = await payment.getOrangeMoneyPaymentStatus({
  payToken: 'your_pay_token',
  accessToken: 'your_access_token',
});
```

Sometimes Orange Money API will not notify your endpoint url, so we recommend to
set up a system that will run `getOrangeMoneyPaymentStatus` every 2 min
depending on your choice.

---
For more information and detailed API documentation, please refer to the
official [Y-Note Merchant payment documentation](<https://mega.nz/folder/83dCDKSK#LqI2j3Wgt6s9xJjtH5K9lA>)

---

## Author

👤 **Spreeloop**

- Website: spreeloop.com
- Github: [@spreeloop](https://github.com/spreeloop)

## 🤝 Contributing

Contributions to the Orange Money Node.js Integration Module are welcome!
 Please feel free to open [issues](https://github.com/spreeloop/core-ts/issues) or submit pull requests to contribute to the
  development of this module.

## Show your support

Give a ⭐️ if this project helped you!
