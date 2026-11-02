# Welcome to @spreeloop/mtn_momo 👋

<p>
  <a href="https://www.npmjs.com/package/@spreeloop/mtn_momo" target="_blank">
    <img alt="Version" src="https://img.shields.io/npm/v/@spreeloop/mtn_momo.svg">
  </a>
  <a href="#" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
</p>

The MTN Mobile Money Node.js Integration Module is a powerful toolkit
designed to simplify the integration of MTN MoMo payment capabilities
into Node.js applications. This module provides developers with a convenient
interface to interact with MTN MoMo APIs, enabling seamless payment
processing and transaction management.

## Features

- **Easy Integration**: Simplifies the integration of MTN MoMo payment
  functionality into Node.js applications.
- **Flexible Configuration**: Allows developers to customize payment
  configurations based on specific requirements.
- **Comprehensive Documentation**: Provides comprehensive documentation and
  examples for easy integration and usage.
- **Supports Multiple Environments**: Supports multiple target environments,
  including production and testing environments.

## Installation

To install the MTN MoMo Node.js Integration Module, simply add it to
your Node.js project using npm:

## Base URL configuration

Set `baseURL` to the MTN MoMo API base URL for the selected `targetEnvironment`.
The consumer chooses the host; the package uses that same configured host
without inferring or switching it based on the environment. The package appends
the API paths automatically.

```typescript
import {
  MtnMomoPayment,
  TargetEnvironment,
  XTargetEnvironmentType,
} from "@spreeloop/mtn_momo";

const config = {
  targetEnvironment: TargetEnvironment.prod,
  baseURL: "https://proxy.momoapi.mtn.com",
  apiKey: "your_api_key",
  apiUserKey: "your_api_user_key",
  xTargetEnvironment: XTargetEnvironmentType.mtnCameroon,
  ocpApimSubscriptionKey: "your_subscription_key",
  logger: console,
};

const payment = MtnMomoPayment.createPayment(config);
```
