/**
 * Centralized logging and error handling wrapper
 *
 * Architecture rationale:
 * - Single responsibility: handles all logging/error tracking
 * - Easy to swap implementations (e.g., Sentry, Firebase)
 * - Provides consistent error handling across the app
 * - Type-safe logging with structured data
 */

import { AppError, LogLevel } from '../types';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  context?: Record<string, any>;
  error?: Error;
}

class Logger {
  private logs: LogEntry[] = [];
  private readonly maxLogs = 100; // Keep last 100 logs in memory

  /**
   * Log info message
   */
  info(message: string, context?: Record<string, any>): void {
    this.log('info', message, context);
  }

  /**
   * Log warning message
   */
  warn(message: string, context?: Record<string, any>): void {
    this.log('warn', message, context);
  }

  /**
   * Log error message
   */
  error(message: string, error?: Error, context?: Record<string, any>): void {
    this.log('error', message, context, error);

    // In production, this would send to Sentry/Firebase
    if (__DEV__) {
      console.error(`[ERROR] ${message}`, error);
    }
  }

  /**
   * Log debug message (only in development)
   */
  debug(message: string, context?: Record<string, any>): void {
    if (__DEV__) {
      this.log('debug', message, context);
    }
  }

  /**
   * Handle caught errors with additional context
   */
  captureError(error: Error, context?: Record<string, any>): void {
    const appError: AppError = {
      message: error.message,
      code: (error as any).code,
      timestamp: new Date(),
      stack: error.stack,
    };

    this.error(error.message, error, { ...context, appError });
  }

  /**
   * Get recent logs (useful for debugging)
   */
  getRecentLogs(count: number = 10): LogEntry[] {
    return this.logs.slice(-count);
  }

  /**
   * Clear all logs
   */
  clearLogs(): void {
    this.logs = [];
  }

  private log(
    level: LogLevel,
    message: string,
    context?: Record<string, any>,
    error?: Error
  ): void {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      context,
      error,
    };

    this.logs.push(entry);

    // Keep memory usage bounded
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Console output in development
    if (__DEV__) {
      const prefix = `[${level.toUpperCase()}]`;
      console.log(prefix, message, context || '');
    }
  }
}

// Singleton instance
export const logger = new Logger();
