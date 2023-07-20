import { MONTHS } from '../../../constants';
import { makeEventsForDay } from './makeEventsForDay';

export const previousMonthDisabledDays = (monthIndex, year, events) => {
  let firstDayOfTheMonthDate = `${monthIndex + 1} 1 ${year}`;
  let firstDayOfTheMonthWeekIndex = new Date(firstDayOfTheMonthDate).getDay();

  const previousMonthDisabledDays = Array(
    firstDayOfTheMonthWeekIndex === 0 ? 6 : firstDayOfTheMonthWeekIndex - 1, // Sunday is 0 Saturday is 6
  )
    .fill(0)
    .map((_, index) => {
      // check leap year
      const previousMonth =
        monthIndex > 0 && monthIndex !== 2
          ? MONTHS[monthIndex - 1]
          : monthIndex === 2
          ? year % 4 === 0
            ? { key: 1, daysInMonth: 29, value: 2, text: 'February' }
            : { key: 1, daysInMonth: 28, value: 2, text: 'February' }
          : MONTHS[11]; // if current month is Jan previous month is Dec

      year = monthIndex > 0 ? year : year - 1;
      const month = monthIndex > 0 ? monthIndex : 12;
      const dayNumber = previousMonth.daysInMonth - index;

      return {
        year,
        month,
        events: makeEventsForDay(year, month, dayNumber, events),
        class: 'day day--disabled',
        dayNumber,
      };
    })
    .reverse();

  return previousMonthDisabledDays;
};
