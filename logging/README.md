# Logger Interface

<p>
  <a href="https://www.npmjs.com/package/@spreeloop/logging" target="_blank">
    <img alt="Version" src="https://img.shields.io/npm/v/@spreeloop/logging.svg">
  </a>
  <a href="#" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
</p>

The Logger interface provides a simple yet effective way to manage logging in your JavaScript or TypeScript applications. With customizable log levels and printers, you can control how log messages are handled and displayed.

## Features

- **Log Levels**: The `Logger` supports different log levels, including `DEBUG`, `INFO`, `WARN`, and `ERROR`. This allows developers to control the verbosity of the logs.
- **Custom Printer**: The `Logger` uses a custom `LogPrinter` function to output log messages. This function can be configured to print logs to various destinations, such as the console, a file, or a remote logging service.
- **Named Loggers**: Each instance of `Logger` can be named, which helps in identifying the source of log messages.

## Installation

You can install the Logger interface via npm:

```bash
npm install logger-interface
```

## Run tests

```sh
npm run test
```

## Usage

Import the `Logger` class into your JavaScript or TypeScript file:

```javascript
import { Logger } from 'logger-interface';
```

Create an instance of the `Logger` class with an optional name parameter:

```javascript
const logger = new Logger('MyLogger');
```

Log messages using the available log level methods: `log`, `info`, `warn`, and `error`:

```javascript
logger.log('This is a debug message');
logger.info('This is an info message');
logger.warn('This is a warning message');
logger.error('This is an error message');
```

## Configuration

### Log Levels

You can set the log level for the entire application using the `Logger.level` static property. The available log levels are:

- `LogLevel.DEBUG`
- `LogLevel.INFO`
- `LogLevel.WARN`
- `LogLevel.ERROR`
- `LogLevel.SILENT` (to disable printing)

### Custom Printer

You can define a custom printer function using the `Logger.printer` static property. This function will be called whenever a log message needs to be printed. By default, log messages are printed to the console.

## Example

```javascript
import { Logger, LogLevel } from 'logger-interface';

Logger.level = LogLevel.DEBUG;

const customPrinter = (log) => {
  // Implement your custom printing logic here
  console.log(`[${log.level}] [${log.name}]: ${log.message}`);
};

Logger.printer = customPrinter;

const logger = new Logger('MyLogger');

logger.log('This is a debug message');
logger.info('This is an info message');
logger.warn('This is a warning message');
logger.error('This is an error message');
```

## Author

👤 **Spreeloop**

- Website: spreeloop.com
- Github: [@spreeloop](https://github.com/spreeloop)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/spreeloop/core-ts/issues).

## Show your support

Give a ⭐️ if this project helped you!
