import { CALCULATOR_PRECISION } from '../constants/MathConstants';

export function isValidExpression(expression: string): boolean {
  if (!expression || expression.trim() === '') {
    return false;
  }
  if (expression.length > CALCULATOR_PRECISION.MAX_EXPRESSION_LENGTH) {
    return false;
  }
  return true;
}

export function isOperator(char: string): boolean {
  return ['+', '-', '*', '/', '^'].includes(char);
}

export function isValidNumber(value: string): boolean {
  const num = Number(value);
  return !isNaN(num) && isFinite(num);
}

export function hasBalancedParentheses(expression: string): boolean {
  let count = 0;
  for (const char of expression) {
    if (char === '(') count++;
    if (char === ')') count--;
    if (count < 0) return false;
  }
  return count === 0;
}

export function validateInput(value: string, expression: string): boolean {
  if (!value || value.trim() === '') {
    return true;
  }
  
  if (expression.length + value.length > CALCULATOR_PRECISION.MAX_EXPRESSION_LENGTH) {
    return false;
  }
  
  return true;
}

export function sanitizeExpression(expression: string): string {
  return expression
    .replace(/[^\d+\-*/.()^πe]/g, '')
    .replace(/\.{2,}/g, '.')
    .trim();
}
