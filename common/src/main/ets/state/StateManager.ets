import { CalculatorState, HistoryItem, AngleMode } from '../types/ExpressionTypes';

export class StateManager {
  private static instance: StateManager;
  private state: CalculatorState = {
    expression: '',
    result: '',
    angleMode: 'DEG',
    isScientificMode: false,
    history: []
  };

  private subscribers: Array<(state: CalculatorState) => void> = [];

  static getInstance(): StateManager {
    if (!StateManager.instance) {
      StateManager.instance = new StateManager();
    }
    return StateManager.instance;
  }

  getState(): CalculatorState {
    return {
      expression: this.state.expression,
      result: this.state.result,
      angleMode: this.state.angleMode,
      isScientificMode: this.state.isScientificMode,
      history: this.state.history
    };
  }

  updateExpression(expression: string): void {
    this.state.expression = expression;
    this.notify();
  }

  updateResult(result: string): void {
    this.state.result = result;
    this.notify();
  }

  toggleAngleMode(): void {
    this.state.angleMode = this.state.angleMode === 'DEG' ? 'RAD' : 'DEG';
    this.notify();
  }

  setAngleMode(mode: AngleMode): void {
    this.state.angleMode = mode;
    this.notify();
  }

  toggleScientificMode(): void {
    this.state.isScientificMode = !this.state.isScientificMode;
    this.notify();
  }

  addToHistory(expression: string, result: string): void {
    const historyItem: HistoryItem = {
      expression,
      result,
      timestamp: Date.now()
    };
    this.state.history = [historyItem, ...this.state.history].slice(0, 100);
    this.notify();
  }

  clearHistory(): void {
    this.state.history = [];
    this.notify();
  }

  clear(): void {
    this.state.expression = '';
    this.state.result = '';
    this.notify();
  }

  subscribe(callback: (state: CalculatorState) => void): void {
    this.subscribers.push(callback);
  }

  unsubscribe(callback: (state: CalculatorState) => void): void {
    this.subscribers = this.subscribers.filter(cb => cb !== callback);
  }

  restoreState(state: CalculatorState): void {
    console.log('[StateManager] Restoring state:', state);
    this.state = {
      expression: state.expression || '',
      result: state.result || '',
      angleMode: state.angleMode || 'DEG',
      isScientificMode: state.isScientificMode || false,
      history: state.history || []
    };
    this.notify();
    console.log('[StateManager] State restored successfully');
  }

  exportState(): CalculatorState {
    return this.getState();
  }

  private notify(): void {
    this.subscribers.forEach(callback => callback(this.getState()));
  }
}
