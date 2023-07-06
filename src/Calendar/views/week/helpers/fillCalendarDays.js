import { selectedWeekDaysWithEvents } from './selectedWeekDaysWithEvents';

export const fillCalendarDays = (allEvents, selectedWeek) => {
  const result = [...selectedWeekDaysWithEvents(selectedWeek, allEvents)];
  return result;
};
