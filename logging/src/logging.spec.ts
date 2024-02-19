import { Logger } from './logging';
import { LogLevel } from './log_level';

describe('logging.ts', () => {
  describe('Logger:log', () => {
    it('should log something when the log level is debug', () => {
      const spy = jest.spyOn(Logger, 'printer');
      Logger.level = LogLevel.DEBUG;
      new Logger().log("it's work");
      expect(spy).toHaveBeenCalledTimes(1);
    });
    it('should not log when the log level is higher than debug', () => {
      const spy = jest.spyOn(Logger, 'printer');
      Logger.level = LogLevel.INFO;
      new Logger().log("it's work");
      expect(spy).not.toHaveBeenCalled();
    });
  });
  describe('Logger:info', () => {
    it('should log something when the log level is info or debug', () => {
      const spy = jest.spyOn(Logger, 'printer');
      Logger.level = LogLevel.DEBUG;
      new Logger().info('info work');
      new Logger().log('log work');
      expect(spy).toHaveBeenCalledTimes(2);
    });
    it('should not log when the log level is higher than info', () => {
      const spy = jest.spyOn(Logger, 'printer');
      Logger.level = LogLevel.WARN;
      new Logger().info("it's work");
      expect(spy).not.toHaveBeenCalled();
    });
  });
  describe('Logger:warn', () => {
    it('should log something when the log level is not higher than warn', () => {
      const spy = jest.spyOn(Logger, 'printer');
      Logger.level = LogLevel.DEBUG;
      new Logger().warn("it's work");
      new Logger().info('info work');
      new Logger().log('log work');
      expect(spy).toHaveBeenCalledTimes(3);
    });
    it('should not log when the log level is higher than warn', () => {
      const spy = jest.spyOn(Logger, 'printer');
      Logger.level = LogLevel.ERROR;
      new Logger().warn("it's work");
      expect(spy).not.toHaveBeenCalled();
    });
  });
  describe('Logger:error', () => {
    it('should log something when the log level is not higher than error', () => {
      const spy = jest.spyOn(Logger, 'printer');
      Logger.level = LogLevel.DEBUG;
      new Logger().error("it's work");
      new Logger().warn('warn work');
      new Logger().info('info work');
      new Logger().log('log work');
      expect(spy).toHaveBeenCalledTimes(4);
    });
    it('should not log when the log level is higher than error', () => {
      const spy = jest.spyOn(Logger, 'printer');
      Logger.level = LogLevel.SILENT;
      new Logger().error("it's work");
      expect(spy).not.toHaveBeenCalled();
    });
  });
});
