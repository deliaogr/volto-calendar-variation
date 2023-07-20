import { makeEventsForDay } from './makeEventsForDay';
import { pastEventsConfig } from './pastEventsConfig';

export const selectedMonthDays = (month, year, monthIndex, events) => {
  const monthDays = Array(month.daysInMonth)
    .fill(0)
    .map((_, index) => {
      // we add 1 because the indexes of days and months start from 0
      const month = monthIndex + 1;
      const dayNumber = index + 1;

      const result = {
        year,
        month,
        dayNumber,
        class: 'day',
        pastEventsConfig: pastEventsConfig(year, month, dayNumber, events),
        events: makeEventsForDay(year, month, dayNumber, events),
      };

      return result;
    });
  return monthDays;
};
