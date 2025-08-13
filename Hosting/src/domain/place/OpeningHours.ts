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
    return this.getWeekdayDescriptions(true);
  }

  /** 各曜日の営業時間（休廊は表示しない） */
  get weekdayDescriptionsWithoutClosed(): string[] {
    return this.getWeekdayDescriptions(false);
  }

  private getWeekdayDescriptions(showClosed: boolean): string[] {
    return WeekDays.filter(
      day => showClosed || this._value[day].length > 0,
    ).map(day => this.getDescriptionForDay(day));
  }

  /** 指定された日付の曜日に対応する営業時間の説明を取得する */
  getDescriptionForDate(date: Date): string {
    const dayIndex = date.getDay(); // 0: 日曜日, 1: 月曜日, ...
    const weekDay = WeekDays[dayIndex];
    return this.getDescriptionForDay(weekDay);
  }

  /** 指定された曜日の営業時間の説明を生成する */
  private getDescriptionForDay(day: WeekDay): string {
    const periods = this._value[day];
    const label = WeekDayLabels[day];

    if (periods.length === 0) {
      return `${label}: 休廊`;
    }

    return `${label}: ${periods.map(p => p.toString()).join(', ')}`;
  }

  update(weekdays: WeekDay[], hours: HoursPeriod[]): void {
    weekdays.forEach(day => {
      this._value[day] = hours;
    });
  }

  toString(): string {
    return this.weekdayDescriptions.toString();
  }

  toJson(): string {
    const json = WeekDays.reduce(
      (acc, day) => {
        acc[day] = this._value[day].map(p => p.toJson());
        return acc;
      },
      {} as Record<WeekDay, string[]>,
    );
    return JSON.stringify(json);
  }

  static fromJson(json?: string): OpeningHours | undefined {
    if (json === undefined) {
      return undefined;
    }

    const parsedData = JSON.parse(json) as Record<WeekDay, string[]>;
    const data = Object.entries(parsedData).reduce(
      (acc, [day, periodStrings]) => {
        acc[day as WeekDay] = periodStrings.map(str =>
          HoursPeriod.fromJson(str),
        );
        return acc;
      },
      {} as Record<WeekDay, HoursPeriod[]>,
    );
    return new OpeningHours(data);
  }
}
