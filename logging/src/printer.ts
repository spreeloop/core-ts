import { LogLevel } from './log_level';

export type LogPrinterArgs = {
  name: string;
  level: LogLevel;
  message: string;
  errorObject?: object;
  stackTrace?: string;
};

export type LogPrinter = (param: LogPrinterArgs) => void;
