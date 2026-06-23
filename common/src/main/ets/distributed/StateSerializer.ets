import { CalculatorState, HistoryItem, AngleMode } from '../types/ExpressionTypes';
import {
  CalculatorStateSnapshot,
  MIGRATION_CONFIG,
  ContinuationErrorCode
} from '../types/MigrationTypes';

interface SnapshotWithoutSignature {
  version: string;
  timestamp: number;
  expression: string;
  result: string;
  angleMode: AngleMode;
  calculatorMode: 'standard' | 'scientific';
  historyRecords: HistoryItem[];
}

export class StateSerializer {
  private static instance: StateSerializer;

  static getInstance(): StateSerializer {
    if (!StateSerializer.instance) {
      StateSerializer.instance = new StateSerializer();
    }
    return StateSerializer.instance;
  }

  serialize(state: CalculatorState): string {
    const historyRecords = this.trimHistory(state.history);
    const snapshotForSig: SnapshotWithoutSignature = {
      version: MIGRATION_CONFIG.DATA_VERSION,
      timestamp: Date.now(),
      expression: state.expression,
      result: state.result,
      angleMode: state.angleMode,
      calculatorMode: state.isScientificMode ? 'scientific' : 'standard',
      historyRecords: historyRecords
    };
    
    const signature = this.generateSignature(snapshotForSig);
    
    const snapshot: CalculatorStateSnapshot = {
      version: snapshotForSig.version,
      timestamp: snapshotForSig.timestamp,
      expression: snapshotForSig.expression,
      result: snapshotForSig.result,
      angleMode: snapshotForSig.angleMode,
      calculatorMode: snapshotForSig.calculatorMode,
      historyRecords: snapshotForSig.historyRecords,
      signature: signature
    };

    const serialized = JSON.stringify(snapshot);

    const dataSize = serialized.length;
    if (dataSize > MIGRATION_CONFIG.MAX_WANT_PARAM_SIZE) {
      throw new Error(`Data size ${dataSize} exceeds limit ${MIGRATION_CONFIG.MAX_WANT_PARAM_SIZE}`);
    }

    return serialized;
  }

  deserialize(serialized: string): CalculatorState {
    let parsed: object;

    try {
      parsed = JSON.parse(serialized);
    } catch (error) {
      throw new Error(`Failed to parse serialized data: ${error}`);
    }

    const snapshot: CalculatorStateSnapshot = {
      version: (parsed as CalculatorStateSnapshot).version,
      timestamp: (parsed as CalculatorStateSnapshot).timestamp,
      expression: (parsed as CalculatorStateSnapshot).expression,
      result: (parsed as CalculatorStateSnapshot).result,
      angleMode: (parsed as CalculatorStateSnapshot).angleMode,
      calculatorMode: (parsed as CalculatorStateSnapshot).calculatorMode,
      historyRecords: (parsed as CalculatorStateSnapshot).historyRecords,
      signature: (parsed as CalculatorStateSnapshot).signature
    };

    if (!this.checkVersionCompatibility(snapshot.version)) {
      throw new Error(`Version ${snapshot.version} is not compatible with current version ${MIGRATION_CONFIG.DATA_VERSION}`);
    }

    if (!this.verifySignature(snapshot)) {
      throw new Error('Data signature verification failed');
    }

    return {
      expression: snapshot.expression,
      result: snapshot.result,
      angleMode: snapshot.angleMode,
      isScientificMode: snapshot.calculatorMode === 'scientific',
      history: snapshot.historyRecords || []
    };
  }

  private trimHistory(history: HistoryItem[]): HistoryItem[] {
    return history.slice(0, MIGRATION_CONFIG.MAX_HISTORY_RECORDS);
  }

  private generateSignature(snapshot: SnapshotWithoutSignature): string {
    const dataToSign = `${snapshot.version}|${snapshot.timestamp}|${snapshot.expression}|${snapshot.result}|${snapshot.angleMode}|${snapshot.calculatorMode}|${JSON.stringify(snapshot.historyRecords)}`;

    let hash = 0;
    for (let i = 0; i < dataToSign.length; i++) {
      const char = dataToSign.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }

    return `sig_${Math.abs(hash).toString(16)}`;
  }

  private verifySignature(snapshot: CalculatorStateSnapshot): boolean {
    const snapshotForSig: SnapshotWithoutSignature = {
      version: snapshot.version,
      timestamp: snapshot.timestamp,
      expression: snapshot.expression,
      result: snapshot.result,
      angleMode: snapshot.angleMode,
      calculatorMode: snapshot.calculatorMode,
      historyRecords: snapshot.historyRecords
    };
    const expectedSignature = this.generateSignature(snapshotForSig);

    return snapshot.signature === expectedSignature;
  }

  private checkVersionCompatibility(version: string): boolean {
    const currentParts = MIGRATION_CONFIG.DATA_VERSION.split('.').map(Number);
    const snapshotParts = version.split('.').map(Number);

    return currentParts[0] === snapshotParts[0];
  }

  getDataSize(serialized: string): number {
    return serialized.length;
  }

  shouldCompress(dataSize: number): boolean {
    return dataSize > MIGRATION_CONFIG.COMPRESSION_THRESHOLD;
  }
}
