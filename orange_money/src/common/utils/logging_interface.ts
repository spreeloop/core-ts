export interface LoggerInterface {
  /**
   * Logs a debug level message.
   * @param {string[]} args
   */
  log(...args: string[]): void;

  /**
   * Logs an info level message.
   * @param {string[]} args
   */
  info(...args: string[]): void;

  /**
   * Logs a waning level message.
   * @param {string[]} args
   */
  warn(...args: string[]): void;

  /**
   * Logs an error level message.
   * @param {string[]} args
   */
  error(...args: string[]): void;
}
