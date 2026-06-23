export function calc(inputContent: string): string {
  const infixExpression: string[] = parseInfixExpression(inputContent);
  const suffixExpression: string[] = toSuffixExpression(infixExpression);
  return calcSuffixExpression(suffixExpression);
}

function parseInfixExpression(inputContent: string): string[] {
  const size: number = inputContent.length;
  const lastIndex = size - 1;
  let singleChar = '';
  const expression: Array<string> = [];
  for (let index = 0; index < size; index++) {
    const element: string = inputContent[index];
    if (isGrouping(element)) {
      if (singleChar !== '') {
        expression.push(singleChar);
        singleChar = '';
      }
      expression.push(element);
    } else if (isOperator(element)) {
      if (isSymbol(element) && (index === 0 || inputContent[index - 1] === '(')) {
        singleChar += element;
      } else {
        if (singleChar !== '') {
          expression.push(singleChar);
          singleChar = '';
        }
        if (index !== lastIndex) {
          expression.push(element);
        }
      }
    } else {
      singleChar += element;
    }
    if (index === lastIndex && singleChar !== '') {
      expression.push(singleChar);
    }
  }
  return expression;
}

function toSuffixExpression(expression: string[]): string[] {
  const operatorStack: Array<string> = [];
  const suffixExpression: Array<string> = [];
  let topOperator: string;
  for (let index = 0, size: number = expression.length; index < size; ++index) {
    const element: string = expression[index];
    if (element === '(') {
      operatorStack.push(element);
      continue;
    }
    if (element === ')') {
      if (operatorStack.length) {
        let operator: string | undefined = operatorStack.pop();
        while (operator !== '(') {
          suffixExpression.push(operator as string);
          operator = operatorStack.pop();
        }
      }
      continue;
    }
    if (isOperator(element)) {
      if (!operatorStack.length) {
        operatorStack.push(element);
      } else {
        topOperator = operatorStack[operatorStack.length - 1];
        if (!isGrouping(topOperator) && !isPrioritized(element, topOperator)) {
          while (operatorStack.length) {
            suffixExpression.push(operatorStack.pop() as string);
          }
        }
        operatorStack.push(element);
      }
      continue;
    }
    suffixExpression.push(element);
  }
  while (operatorStack.length) {
    suffixExpression.push(operatorStack.pop() as string);
  }
  return suffixExpression;
}

function calcSuffixExpression(expression: string[]): string {
  const numberStack: Array<string> = [];
  while (expression.length) {
    let element: string | undefined = expression.shift();
    if (!isOperator(element as string)) {
      numberStack.push(element as string);
    } else {
      const firstStackElement: string | undefined = numberStack.pop();
      const secondStackElement: string | undefined = numberStack.pop();
      const result: string = OPERATORHANDLERS[element as string](secondStackElement, firstStackElement);
      if (result.length > 15) {
        numberStack.push((Number.parseFloat(result).toExponential()) as string);
      } else {
        numberStack.push(result);
      }
    }
  }
  return numberStack[0];
}

function isOperator(operator: string): boolean {
  return operator === '+' || operator === '-' || operator === '*' || operator === '/';
}

function isGrouping(operator: string): boolean {
  return operator === '(' || operator === ')';
}

function isSymbol(symbol: string): boolean {
  return symbol === '+' || symbol === '-';
}

function isPrioritized(firstOperator: string, secondOperator: string): boolean {
  return OPERATORLEVELS[firstOperator] > OPERATORLEVELS[secondOperator];
}

const OPERATORLEVELS: Record<string, number> = {
  '+': 0,
  '-': 0,
  '*': 1,
  '/': 1,
};

const OPERATORHANDLERS: Record<string, Function> = {
  '+': (firstOperand: string, secondOperand: string) => 
    (Number.parseFloat(firstOperand) + Number.parseFloat(secondOperand)).toFixed(
      getFloatNum(Number(firstOperand), Number(secondOperand), '+')),
  '-': (firstOperand: number, secondOperand: number) => 
    (firstOperand - secondOperand).toFixed(getFloatNum(firstOperand, secondOperand, '-')),
  '*': (firstOperand: number, secondOperand: number) => 
    (firstOperand * secondOperand).toFixed(getFloatNum(firstOperand, secondOperand, '*')),
  '/': (firstOperand: number, secondOperand: number) => 
    (firstOperand / secondOperand).toFixed(getFloatNum(firstOperand, secondOperand, '/')),
};

function getFloatNum(firstOperand: number, secondOperand: number, operate: string): number {
  let result = 0;
  let oneString = firstOperand.toString();
  let otherString = secondOperand.toString();
  let firstNum = 0;
  if (oneString.indexOf('.') !== -1) {
    firstNum = oneString.split('.')[1].length;
  }
  let secondNum = 0;
  if (otherString.indexOf('.') !== -1) {
    secondNum = otherString.split('.')[1].length;
  }
  if (operate === '+' || operate === '-') {
    result = Math.max(firstNum, secondNum);
  }
  if (operate === '*') {
    result = firstNum + secondNum;
  }
  if (operate === '/') {
    result = (firstNum + otherString.length) > 3 ? (firstNum + otherString.length) : 3;
  }
  return result;
}
