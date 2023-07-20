import { makeEventsForDay } from './makeEventsForDay';

export const nextMonthDisabledDays = (month, monthIndex, year, events) => {
  let lastDayOfTheMonthDate = `${monthIndex + 1} ${month.daysInMonth} ${year}`;
  let lastDayOfTheMonthWeekIndex = new Date(lastDayOfTheMonthDate).getDay();

  const nextMonthDisabledDays = Array(7 - lastDayOfTheMonthWeekIndex)
    .fill(0)
    .map((_, index) => {
      year = monthIndex < 11 ? year : year + 1;
      const month = monthIndex < 11 ? monthIndex + 2 : 1;
      const dayNumber = index + 1;

      return {
        year,
        month,
        dayNumber,
        class: 'day day--disabled',
        events: makeEventsForDay(year, month, dayNumber, events),
      };
    });

  return nextMonthDisabledDays;
};
