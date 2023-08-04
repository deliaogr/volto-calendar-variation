import { makeEventsForDay } from './makeEventsForDay';

export const selectedMonthDays = (month, year, monthIndex, events) => {
  const monthDays = Array(month.daysInMonth)
    .fill(0)
    .map((_, index) => {
      // we add 1 because the indexes of days and months start from 0
      const month = monthIndex + 1;
      const dayNumber = index + 1;

      return {
        year,
        month,
        dayNumber,
        class: 'day',
        events: makeEventsForDay(year, month, dayNumber, events),
      };
    });
  return monthDays;
};
