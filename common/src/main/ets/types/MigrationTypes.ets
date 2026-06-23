import { CalculatorState, HistoryItem, AngleMode } from './ExpressionTypes';

export interface DistributedCalculatorState {
  expression: string;
  result: string;
  angleMode: AngleMode;
  calculatorMode: 'standard' | 'scientific';
  timestamp: number;
}

export interface CalculatorStateSnapshot {
  version: string;
  timestamp: number;
  expression: string;
  result: string;
  angleMode: AngleMode;
  calculatorMode: 'standard' | 'scientific';
  historyRecords: HistoryItem[];
  signature: string;
}

export interface WantParam {
  sessionId?: string;
  stateData?: string;
  dataSize?: number;
  version?: string;
}

export interface ContinuationResult {
  success: boolean;
  error?: ContinuationErrorCode;
  message?: string;
}

export enum ContinuationErrorCode {
  SUCCESS = 0,
  ENVIRONMENT_INVALID = 1,
  ACCOUNT_INCONSISTENT = 2,
  VERSION_INCOMPATIBLE = 3,
  DATA_EXCEED_LIMIT = 4,
  NETWORK_ERROR = 5,
  DEVICE_OFFLINE = 6,
  SIGNATURE_INVALID = 7,
  SESSION_ID_INVALID = 8,
  DATA_RESTORE_FAILED = 9
}

export interface EnvironmentCheckResult {
  isValid: boolean;
  wifiEnabled: boolean;
  bluetoothEnabled: boolean;
  accountConsistent: boolean;
  targetDeviceAvailable: boolean;
  errors: string[];
}

export enum MigrationState {
  IDLE = 'IDLE',
  PREPARING = 'PREPARING',
  TRANSFERRING = 'TRANSFERRING',
  RESTORING = 'RESTORING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export interface MigrationContext {
  sessionId: string;
  sourceDeviceId: string;
  targetDeviceId: string;
  startTime: number;
  endTime?: number;
  state: MigrationState;
  dataSize: number;
  error?: ContinuationErrorCode;
}

export interface MigrationConfig {
  MAX_WANT_PARAM_SIZE: number;
  COMPRESSION_THRESHOLD: number;
  MAX_HISTORY_RECORDS: number;
  DATA_VERSION: string;
  SESSION_ID_PREFIX: string;
}

export const MIGRATION_CONFIG: MigrationConfig = {
  MAX_WANT_PARAM_SIZE: 100 * 1024,
  COMPRESSION_THRESHOLD: 80 * 1024,
  MAX_HISTORY_RECORDS: 20,
  DATA_VERSION: '1.0.0',
  SESSION_ID_PREFIX: 'calc_migration_'
};
