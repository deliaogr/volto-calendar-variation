import { previousMonthDisabledDays } from './previousMonthDisabledDays';
import { nextMonthDisabledDays } from './nextMonthDisabledDays';
import { selectedMonthDays } from './selectedMonthDays';
import { MONTHS } from '../../../constants';

export const fillCalendarDays = (monthIndex, events, year) => {
  // check leap year
  const month =
    monthIndex === 1
      ? year % 4 === 0
        ? { key: 1, daysInMonth: 29, value: 2, text: 'February' }
        : { key: 1, daysInMonth: 28, value: 2, text: 'February' }
      : MONTHS[monthIndex];
  return [
    ...previousMonthDisabledDays(monthIndex, year, events),
    ...selectedMonthDays(month, year, monthIndex, events),
    ...nextMonthDisabledDays(month, monthIndex, year, events),
  ];
};
