import { HourPoint, HoursPeriod, WeekDay, WeekDayLabels, WeekDays } from '.';

export class OpeningHours {
  private readonly _symbol: symbol = Symbol();

  private _value: Record<WeekDay, HoursPeriod[]>;

  constructor(value: Record<WeekDay, HoursPeriod[]>) {
    void this._symbol;

    this._value = WeekDays.reduce(
      (acc, day) => ({
        ...acc,
        [day]: value[day] ?? [],
      }),
      {} as Record<WeekDay, HoursPeriod[]>,
    );
  }

  /** Google Maps Places APIの営業時間データからインスタンスを作成する */
  static fromGooglePlaces(
    openingHours?: google.maps.places.OpeningHours | null,
  ): OpeningHours {
    const emptyRecord = {} as Record<WeekDay, HoursPeriod[]>;
    const empty = new OpeningHours(emptyRecord);

    if (openingHours === undefined || openingHours === null) {
      return empty;
    }

    const periods = openingHours.periods;
    if (periods.length === 0) {
      return empty;
    }

    const value = WeekDays.reduce((acc, day, index) => {
      const googleDay = index; // Google Places APIの日曜日は0

      const dayPeriods = periods
        .filter(p => p.open.day === googleDay)
        .map(p => {
          const open = new HourPoint(p.open.hour, p.open.minute);
          const close =
            p.close !== null
              ? new HourPoint(p.close.hour, p.close.minute)
              : undefined;

          return new HoursPeriod(open, close);
        })
        // 開始時間でソート
        .sort((a, b) => {
          if (a.open.hour !== b.open.hour) {
            return a.open.hour - b.open.hour;
          }
          return a.open.minute - b.open.minute;
        });

      acc[day] = dayPeriods;
      return acc;
    }, emptyRecord);

    return new OpeningHours(value);
  }

  /** 各曜日の営業時間 */
  get weekdayDescriptions(): string[] {
    return WeekDays.map(day => {
      const periods = this._value[day];
      const label = WeekDayLabels[day];

      if (periods.length === 0) {
        return `${label}: 休廊`;
      }

      return `${label}: ${periods.map(p => p.toString()).join(', ')}`;
    });
  }

  update(weekdays: WeekDay[], hours: HoursPeriod[]): void {
    weekdays.forEach(day => {
      this._value[day] = hours;
    });
  }

  toString(): string {
    return this.weekdayDescriptions.toString();
  }
}
