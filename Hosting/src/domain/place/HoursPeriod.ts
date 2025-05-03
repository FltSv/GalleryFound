import { HourPoint } from '.';

type HoursPeriodJson = {
  open: string;
  close: string;
};

export class HoursPeriod {
  private readonly _symbol: symbol = Symbol();

  private readonly _open: HourPoint;
  private readonly _close: HourPoint;

  constructor(open: HourPoint, close?: HourPoint) {
    void this._symbol;

    const closePoint = close ?? new HourPoint(24, 0);
    this.validate(open, closePoint);

    this._open = open;
    this._close = closePoint;
  }

  get open(): HourPoint {
    return this._open;
  }

  get close(): HourPoint {
    return this._close;
  }

  private validate(open: HourPoint, close: HourPoint): void {
    if (open.hour > close.hour) {
      throw new Error('開始時間が終了時間よりも後になっています。');
    }

    if (open.hour === close.hour && open.minute >= close.minute) {
      throw new Error('開始時間が終了時間よりも後になっています。');
    }
  }

  toString(): string {
    return `${this._open.toString()} - ${this._close.toString()}`;
  }

  toJson(): string {
    const json: HoursPeriodJson = {
      open: this._open.toJson(),
      close: this._close.toJson(),
    };
    return JSON.stringify(json);
  }

  static fromJson(json: string): HoursPeriod {
    const data = JSON.parse(json) as HoursPeriodJson;
    return new HoursPeriod(
      HourPoint.fromJson(data.open),
      HourPoint.fromJson(data.close),
    );
  }
}
