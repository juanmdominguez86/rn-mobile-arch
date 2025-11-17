/**
 * Logger Unit Tests
 */

import { logger } from '../Logger';

describe('Logger', () => {
  beforeEach(() => {
    logger.clearLogs();
    jest.clearAllMocks();
  });

  it('should log info messages', () => {
    logger.info('Test info message', { key: 'value' });
    const logs = logger.getRecentLogs(1);

    expect(logs).toHaveLength(1);
    expect(logs[0].level).toBe('info');
    expect(logs[0].message).toBe('Test info message');
    expect(logs[0].context).toEqual({ key: 'value' });
  });

  it('should log warning messages', () => {
    logger.warn('Test warning', { severity: 'medium' });
    const logs = logger.getRecentLogs(1);

    expect(logs).toHaveLength(1);
    expect(logs[0].level).toBe('warn');
    expect(logs[0].message).toBe('Test warning');
  });

  it('should log error messages', () => {
    const error = new Error('Test error');
    logger.error('Error occurred', error, { context: 'test' });
    const logs = logger.getRecentLogs(1);

    expect(logs).toHaveLength(1);
    expect(logs[0].level).toBe('error');
    expect(logs[0].error).toBe(error);
  });

  it('should capture errors with context', () => {
    const error = new Error('Capture test');
    logger.captureError(error, { source: 'test' });
    const logs = logger.getRecentLogs(1);

    expect(logs).toHaveLength(1);
    expect(logs[0].level).toBe('error');
    expect(logs[0].context?.source).toBe('test');
  });

  it('should limit stored logs to maxLogs', () => {
    // Log more than maxLogs (100) entries
    for (let i = 0; i < 150; i++) {
      logger.info(`Message ${i}`);
    }

    const logs = logger.getRecentLogs(150);
    expect(logs.length).toBeLessThanOrEqual(100);
  });

  it('should clear all logs', () => {
    logger.info('Test message');
    expect(logger.getRecentLogs()).toHaveLength(1);

    logger.clearLogs();
    expect(logger.getRecentLogs()).toHaveLength(0);
  });
});
