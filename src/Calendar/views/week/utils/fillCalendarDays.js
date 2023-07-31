import { selectedWeekDaysWithEvents } from './selectedWeekDaysWithEvents';

export const fillCalendarDays = (allEvents, selectedWeek) => {
  return [...selectedWeekDaysWithEvents(selectedWeek, allEvents)];
};
