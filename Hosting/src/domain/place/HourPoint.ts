export class HourPoint {
  private readonly _symbol: symbol = Symbol();

  private readonly _hour: number;
  private readonly _minute: number;

  constructor(hour: number, minute: number) {
    void this._symbol;

    this.validateHour(hour);
    this.validateMinute(minute);
    this.validateTime(hour, minute);

    this._hour = hour;
    this._minute = minute;
  }

  get hour(): number {
    return this._hour;
  }

  get minute(): number {
    return this._minute;
  }

  private validateHour(hour: number): void {
    if (hour < 0 || hour > 24) {
      throw new Error('0-24の範囲で入力してください。');
    }

    if (!Number.isInteger(hour)) {
      throw new Error('整数を入力してください。');
    }
  }

  private validateMinute(minute: number): void {
    if (minute < 0 || minute > 59) {
      throw new Error('0-59の範囲で入力してください。');
    }

    if (!Number.isInteger(minute)) {
      throw new Error('整数を入力してください。');
    }
  }

  private validateTime(hour: number, minute: number): void {
    if (hour === 24 && minute > 0) {
      throw new Error('24:00を超える時間は入力できません。');
    }
  }

  toString(): string {
    const hour = this._hour.toString().padStart(2, '0');
    const minute = this._minute.toString().padStart(2, '0');
    return `${hour}:${minute}`;
  }
}
