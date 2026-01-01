import './extensions/numberExtensions';

export interface UID<T> {
  value: T
  equals(other: any | T): boolean
}

export class NumberUID implements UID<number> {
  public readonly value: number;

  constructor(value: number) {
    this.value = value;
  }

  equals(other: any | number): boolean {
    const result = Number.tryParse(other);
    return result.success && result.value == this.value;
  }
}