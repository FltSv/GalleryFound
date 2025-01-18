export class UserName {
  private readonly _symbol: symbol = Symbol();
  private readonly _value: string;

  constructor(value: string) {
    const trimmed = this.trimSpaces(value);
    this.validate(trimmed);

    this._value = trimmed;
  }

  toString(): string {
    return this._value;
  }

  /** 前後の半角・全角スペースを取り除く */
  private trimSpaces(input: string): string {
    return input.replace(/^[\s\u3000]+|[\s\u3000]+$/g, '');
  }

  private validate(value: string): void {
    if (value.length < 1) {
      throw new Error('1文字以上の入力が必要です。');
    }
  }
}
