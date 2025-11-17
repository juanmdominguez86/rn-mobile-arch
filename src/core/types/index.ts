/**
 * Core type definitions for the application
 */

export interface FeedItem {
  id: string;
  title: string;
  thumbnail: string;
  description?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
}

export interface AppError {
  message: string;
  code?: string;
  timestamp: Date;
  stack?: string;
}

export type LogLevel = 'info' | 'warn' | 'error' | 'debug';
