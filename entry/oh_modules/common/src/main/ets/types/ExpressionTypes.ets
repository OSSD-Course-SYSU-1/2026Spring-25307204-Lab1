export interface CalculatorState {
  expression: string;
  result: string;
  angleMode: 'DEG' | 'RAD';
  isScientificMode: boolean;
  history: HistoryItem[];
}

export interface HistoryItem {
  expression: string;
  result: string;
  timestamp: number;
}

export interface ButtonConfig {
  value: string;
  label: string;
  type: 'number' | 'operator' | 'function' | 'action';
  color: string;
}

export type InputValue = string;

export type AngleMode = 'DEG' | 'RAD';

export interface ScientificFunctionResult {
  success: boolean;
  value: number | string;
  error?: string;
}
