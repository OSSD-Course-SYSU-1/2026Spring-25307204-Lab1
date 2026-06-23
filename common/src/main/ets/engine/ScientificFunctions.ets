export class ScientificFunctions {
  private angleMode: 'DEG' | 'RAD' = 'DEG';

  setAngleMode(mode: 'DEG' | 'RAD'): void {
    this.angleMode = mode;
  }

  getAngleMode(): 'DEG' | 'RAD' {
    return this.angleMode;
  }

  private toRadians(angle: number): number {
    return this.angleMode === 'DEG' ? (angle * Math.PI) / 180 : angle;
  }

  private toDegrees(radians: number): number {
    return this.angleMode === 'DEG' ? (radians * 180) / Math.PI : radians;
  }

  sqrt(num: number): number | string {
    if (num < 0) {
      return 'Error';
    }
    return Math.sqrt(num);
  }

  ln(num: number): number | string {
    if (num <= 0) {
      return 'Error';
    }
    return Math.log(num);
  }

  log10(num: number): number | string {
    if (num <= 0) {
      return 'Error';
    }
    return Math.log10(num);
  }

  sin(angle: number): number {
    return Math.sin(this.toRadians(angle));
  }

  cos(angle: number): number {
    return Math.cos(this.toRadians(angle));
  }

  tan(angle: number): number | string {
    const radians = this.toRadians(angle);
    if (Math.abs(Math.cos(radians)) < 1e-10) {
      return 'Error';
    }
    return Math.tan(radians);
  }

  arcsin(num: number): number | string {
    if (num < -1 || num > 1) {
      return 'Error';
    }
    const result = Math.asin(num);
    return this.toDegrees(result);
  }

  arccos(num: number): number | string {
    if (num < -1 || num > 1) {
      return 'Error';
    }
    const result = Math.acos(num);
    return this.toDegrees(result);
  }

  arctan(num: number): number {
    const result = Math.atan(num);
    return this.toDegrees(result);
  }

  power(base: number, exponent: number): number {
    return Math.pow(base, exponent);
  }

  exp(num: number): number {
    return Math.exp(num);
  }

  tenPower(num: number): number {
    return Math.pow(10, num);
  }

  factorial(num: number): number | string {
    if (!Number.isInteger(num) || num < 0) {
      return 'Error';
    }
    if (num === 0 || num === 1) {
      return 1;
    }
    if (num > 170) {
      return 'Error';
    }
    let result = 1;
    for (let i = 2; i <= num; i++) {
      result *= i;
    }
    return result;
  }

  percent(num: number): number {
    return num / 100;
  }

  reciprocal(num: number): number | string {
    if (num === 0) {
      return 'Error';
    }
    return 1 / num;
  }

  square(num: number): number {
    return num * num;
  }

  cube(num: number): number {
    return num * num * num;
  }
}
