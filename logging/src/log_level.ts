export enum LogLevel {
  /**
   * Development verbose information.
   */
  DEBUG,
  /**
   * Significant messages.
   */
  INFO,
  /**
   * Really important stuff.
   */
  WARN,
  /**
   * General purpose error.
   */
  ERROR,
  /**
   * Disable the logging system.
   */
  SILENT,
}

export const LevelName: Record<LogLevel, string> = {
  [LogLevel.DEBUG]: 'DEBUG',
  [LogLevel.INFO]: 'INFO',
  [LogLevel.WARN]: 'WARN',
  [LogLevel.ERROR]: 'ERROR',
  [LogLevel.SILENT]: 'SILENT',
};
