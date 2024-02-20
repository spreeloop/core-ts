import { LogLevel } from './log_level';
import { LogPrinter } from './printer';

/**
 * The main class of our logging system.
 */
export class Logger {
  /**
   * The lowest log level to use.
   * Use LogLevel.SILENT to disable printing.
   */
  static level: LogLevel = LogLevel.DEBUG;

  /**
   * A variable that contains a printer configuration that will be
   * called for debugging some message to the output.
   */
  static printer: LogPrinter = () => {
    return;
  };

  /**
   * Constructs a new [Logger] implementation.
   * @param {string} name
   */
  constructor(private name: string = '') {}

  /**
   * Sends a print message to a registered printer.
   * @param {Object} props
   * @return {void}
   */
  private print(props: { level: LogLevel; message: string }): void {
    if (props.level < Logger.level) {
      return;
    }

    Logger.printer({
      name: this.name,
      level: props.level,
      message: props.message,
    });
    switch (props.level) {
      case LogLevel.DEBUG:
        console.log(props.message);
        break;
      case LogLevel.INFO:
        console.info(props.message);
        break;
      case LogLevel.ERROR:
        console.error(props.message);
        break;
      case LogLevel.WARN:
        console.warn(props.message);
        break;
    }
  }

  /**
   * Log a debug level message.
   * @param {string[]} args
   */
  log(...args: string[]): void {
    this.print({ level: LogLevel.DEBUG, message: args.join('\n') });
  }
  /**
   * Log an info level message.
   * @param {string[]} args
   */
  info(...args: string[]): void {
    this.print({ level: LogLevel.INFO, message: args.join('\n') });
  }
  /**
   * Log a waning level message.
   * @param {string[]} args
   */
  warn(...args: string[]): void {
    this.print({ level: LogLevel.WARN, message: args.join('\n') });
  }
  /**
   * Log an error level message.
   * @param {string[]} args
   */
  error(...args: string[]): void {
    this.print({ level: LogLevel.ERROR, message: args.join('\n') });
  }
}
