import moment from 'moment';

export const isEventFromLastWeek = (index, date, eventsMatrix) => {
  const currentDay = new Date(date);
  const previousDay = new Date(date);
  previousDay.setDate(previousDay.getDate() - 1);
  const prevDayFormat = moment(previousDay).format('YYYY-MM-DD');
  // if current day is monday and there is an event on previous day(sunday) at the current index from map
  // and also continues to the current day, then return true
  return currentDay.getDay() === 1 && eventsMatrix[prevDayFormat]?.[index];
};
