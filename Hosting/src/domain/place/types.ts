export const WeekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] as const;
export type WeekDay = (typeof WeekDays)[number];
export const WeekDayLabels: Record<WeekDay, string> = {
  Su: '日曜日',
  Mo: '月曜日',
  Tu: '火曜日',
  We: '水曜日',
  Th: '木曜日',
  Fr: '金曜日',
  Sa: '土曜日',
};
