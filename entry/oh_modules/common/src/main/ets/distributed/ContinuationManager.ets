import { Want, AbilityConstant } from '@kit.AbilityKit';
import { CalculatorState } from '../types/ExpressionTypes';
import {
  ContinuationErrorCode,
  MigrationState,
  MigrationContext,
  MIGRATION_CONFIG,
  WantParam
} from '../types/MigrationTypes';
import { StateSerializer } from './StateSerializer';
import { MigrationErrorHandler } from './MigrationErrorHandler';
import { StateManager } from '../state/StateManager';

export interface OnContinueResult {
  AGREE: 0;
  REJECT: 1;
  MISMATCH: 2;
}

export class ContinuationManager {
  private static instance: ContinuationManager;
  private stateManager: StateManager;
  private serializer: StateSerializer;
  private errorHandler: MigrationErrorHandler;
  private migrationState: MigrationState = MigrationState.IDLE;
  private currentContext?: MigrationContext;

  private constructor() {
    this.stateManager = StateManager.getInstance();
    this.serializer = StateSerializer.getInstance();
    this.errorHandler = MigrationErrorHandler.getInstance();
  }

  static getInstance(): ContinuationManager {
    if (!ContinuationManager.instance) {
      ContinuationManager.instance = new ContinuationManager();
    }
    return ContinuationManager.instance;
  }

  onContinue(wantParam: WantParam): number {
    console.log('[ContinuationManager] onContinue called');

    try {
      this.migrationState = MigrationState.PREPARING;

      const sessionId = this.generateSessionId();
      console.log(`[ContinuationManager] Generated sessionId: ${sessionId}`);

      const currentState = this.stateManager.getState();
      console.log('[ContinuationManager] Current state:', currentState);

      const serializedState = this.serializer.serialize(currentState);
      const dataSize = this.serializer.getDataSize(serializedState);
      console.log(`[ContinuationManager] Serialized data size: ${dataSize} bytes`);

      if (dataSize > MIGRATION_CONFIG.MAX_WANT_PARAM_SIZE) {
        this.errorHandler.handleError(
          ContinuationErrorCode.DATA_EXCEED_LIMIT,
          `Data size ${dataSize} exceeds limit ${MIGRATION_CONFIG.MAX_WANT_PARAM_SIZE}`
        );
        this.migrationState = MigrationState.FAILED;
        return 1; // REJECT
      }

      wantParam.sessionId = sessionId;
      wantParam.stateData = serializedState;
      wantParam.dataSize = dataSize;
      wantParam.version = MIGRATION_CONFIG.DATA_VERSION;

      this.currentContext = {
        sessionId,
        sourceDeviceId: '',
        targetDeviceId: '',
        startTime: Date.now(),
        state: MigrationState.TRANSFERRING,
        dataSize
      };

      this.migrationState = MigrationState.TRANSFERRING;
      console.log('[ContinuationManager] onContinue completed successfully');

      return 0; // AGREE
    } catch (error) {
      console.error('[ContinuationManager] onContinue failed:', error);
      this.errorHandler.handleError(
        ContinuationErrorCode.DATA_RESTORE_FAILED,
        `Failed to prepare migration: ${error}`
      );
      this.migrationState = MigrationState.FAILED;
      return 1; // REJECT
    }
  }

  onCreate(want: Want, launchParam: AbilityConstant.LaunchParam): void {
    console.log('[ContinuationManager] onCreate called');

    const isContinuation = launchParam.launchReason === AbilityConstant.LaunchReason.CONTINUATION;
    console.log(`[ContinuationManager] Is continuation: ${isContinuation}`);

    if (isContinuation && want.parameters) {
      this.restoreState(want.parameters as WantParam);
    }
  }

  onNewWant(want: Want, launchParam: AbilityConstant.LaunchParam): void {
    console.log('[ContinuationManager] onNewWant called');

    const isContinuation = launchParam.launchReason === AbilityConstant.LaunchReason.CONTINUATION;

    if (isContinuation && want.parameters) {
      this.restoreState(want.parameters as WantParam);
    }
  }

  private restoreState(wantParam: WantParam): void {
    console.log('[ContinuationManager] restoreState called');

    try {
      this.migrationState = MigrationState.RESTORING;

      const sessionId = wantParam.sessionId;
      const stateData = wantParam.stateData;
      const version = wantParam.version;

      console.log(`[ContinuationManager] Restoring with sessionId: ${sessionId}, version: ${version}`);

      if (!sessionId || !stateData) {
        throw new Error('Missing sessionId or stateData in wantParam');
      }

      const restoredState: CalculatorState = this.serializer.deserialize(stateData);
      console.log('[ContinuationManager] Deserialized state:', restoredState);

      this.stateManager.restoreState(restoredState);
      console.log('[ContinuationManager] State restored successfully');

      this.migrationState = MigrationState.COMPLETED;

      if (this.currentContext) {
        this.currentContext.endTime = Date.now();
        this.currentContext.state = MigrationState.COMPLETED;
      }

      console.log('[ContinuationManager] Migration completed successfully');
    } catch (error) {
      console.error('[ContinuationManager] restoreState failed:', error);
      this.errorHandler.handleError(
        ContinuationErrorCode.DATA_RESTORE_FAILED,
        `Failed to restore state: ${error}`
      );
      this.migrationState = MigrationState.FAILED;

      if (this.currentContext) {
        this.currentContext.state = MigrationState.FAILED;
      }
    }
  }

  private generateSessionId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `${MIGRATION_CONFIG.SESSION_ID_PREFIX}${timestamp}_${random}`;
  }

  getMigrationState(): MigrationState {
    return this.migrationState;
  }

  getMigrationContext(): MigrationContext | undefined {
    return this.currentContext;
  }

  resetMigrationState(): void {
    this.migrationState = MigrationState.IDLE;
    this.currentContext = undefined;
  }

  destroy(): void {
    console.log('[ContinuationManager] destroy called');
    this.resetMigrationState();
  }
}
