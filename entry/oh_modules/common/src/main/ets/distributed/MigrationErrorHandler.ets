import { ContinuationErrorCode, MigrationState, MigrationContext } from '../types/MigrationTypes';

export interface MigrationError {
  code: ContinuationErrorCode;
  message: string;
  timestamp: number;
  deviceId?: string;
  sessionId?: string;
}

export class MigrationErrorHandler {
  private static instance: MigrationErrorHandler;
  private errorLog: MigrationError[] = [];
  private maxLogSize: number = 100;

  static getInstance(): MigrationErrorHandler {
    if (!MigrationErrorHandler.instance) {
      MigrationErrorHandler.instance = new MigrationErrorHandler();
    }
    return MigrationErrorHandler.instance;
  }

  handleError(
    code: ContinuationErrorCode,
    message: string,
    deviceId?: string,
    sessionId?: string
  ): MigrationError {
    const error: MigrationError = {
      code,
      message,
      timestamp: Date.now(),
      deviceId,
      sessionId
    };

    this.logError(error);

    switch (code) {
      case ContinuationErrorCode.DEVICE_OFFLINE:
        this.handleDeviceOffline(error);
        break;
      case ContinuationErrorCode.ACCOUNT_INCONSISTENT:
        this.handleAccountInconsistent(error);
        break;
      case ContinuationErrorCode.VERSION_INCOMPATIBLE:
        this.handleVersionIncompatible(error);
        break;
      case ContinuationErrorCode.DATA_EXCEED_LIMIT:
        this.handleDataExceedLimit(error);
        break;
      case ContinuationErrorCode.SIGNATURE_INVALID:
        this.handleSignatureInvalid(error);
        break;
      default:
        this.handleGenericError(error);
    }

    return error;
  }

  private logError(error: MigrationError): void {
    this.errorLog.unshift(error);
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog = this.errorLog.slice(0, this.maxLogSize);
    }

    console.error(`[MigrationErrorHandler] ${error.code}: ${error.message}`, {
      timestamp: error.timestamp,
      deviceId: error.deviceId,
      sessionId: error.sessionId
    });
  }

  private handleDeviceOffline(error: MigrationError): void {
    console.warn(`Target device offline: ${error.deviceId}. Migration rejected.`);
  }

  private handleAccountInconsistent(error: MigrationError): void {
    console.error(`Account inconsistent. Migration rejected for security.`);
  }

  private handleVersionIncompatible(error: MigrationError): void {
    console.warn(`Version incompatible. Attempting compatibility fallback.`);
  }

  private handleDataExceedLimit(error: MigrationError): void {
    console.warn(`Data size exceeds limit. Compression or data trimming required.`);
  }

  private handleSignatureInvalid(error: MigrationError): void {
    console.error(`Data signature invalid. Possible data tampering detected.`);
  }

  private handleGenericError(error: MigrationError): void {
    console.error(`Migration error: ${error.message}`);
  }

  rollbackMigration(context: MigrationContext): void {
    console.log(`Rolling back migration: ${context.sessionId}`);

    console.log(`Migration rollback completed for session: ${context.sessionId}`);
  }

  getErrorLog(): MigrationError[] {
    return this.errorLog.slice();
  }

  clearErrorLog(): void {
    this.errorLog = [];
  }

  getLastError(): MigrationError | undefined {
    return this.errorLog.length > 0 ? this.errorLog[0] : undefined;
  }

  hasRecentErrors(timeWindowMs: number = 60000): boolean {
    const now = Date.now();
    return this.errorLog.some(error => now - error.timestamp < timeWindowMs);
  }

  getErrorCountByCode(code: ContinuationErrorCode): number {
    return this.errorLog.filter(error => error.code === code).length;
  }

  getErrorMessage(code: ContinuationErrorCode): string {
    switch (code) {
      case ContinuationErrorCode.SUCCESS:
        return 'Operation successful';
      case ContinuationErrorCode.ENVIRONMENT_INVALID:
        return 'Migration environment is invalid';
      case ContinuationErrorCode.ACCOUNT_INCONSISTENT:
        return 'Account is inconsistent across devices';
      case ContinuationErrorCode.VERSION_INCOMPATIBLE:
        return 'Application version is incompatible';
      case ContinuationErrorCode.DATA_EXCEED_LIMIT:
        return 'Migration data exceeds size limit';
      case ContinuationErrorCode.NETWORK_ERROR:
        return 'Network connection error';
      case ContinuationErrorCode.DEVICE_OFFLINE:
        return 'Target device is offline';
      case ContinuationErrorCode.SIGNATURE_INVALID:
        return 'Data signature verification failed';
      case ContinuationErrorCode.SESSION_ID_INVALID:
        return 'Session ID is invalid';
      case ContinuationErrorCode.DATA_RESTORE_FAILED:
        return 'Failed to restore data';
      default:
        return 'Unknown error';
    }
  }
}
