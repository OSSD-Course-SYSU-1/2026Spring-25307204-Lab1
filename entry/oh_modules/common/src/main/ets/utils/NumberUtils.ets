export function formatNumber(num: number, precision: number = 10): string {
  if (Number.isNaN(num) || !Number.isFinite(num)) {
    return 'Error';
  }
  
  const formatted = num.toFixed(precision);
  return formatted.replace(/\.?0+$/, '');
}

export function isNumeric(str: string): boolean {
  return !isNaN(Number(str)) && str.trim() !== '';
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function toScientificNotation(num: number, precision: number = 6): string {
  return num.toExponential(precision);
}

export function isInteger(num: number): boolean {
  return Number.isInteger(num);
}

export function getDecimalPlaces(num: number): number {
  const str = num.toString();
  if (str.indexOf('.') === -1) {
    return 0;
  }
  return str.split('.')[1].length;
}

export function roundTo(num: number, places: number): number {
  const multiplier = Math.pow(10, places);
  return Math.round(num * multiplier) / multiplier;
}
