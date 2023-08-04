import moment from 'moment';

export const eventExtendsOnMonday = (event, date) => {
  const currentDay = new Date(date);
  const currentDayWeekIndex = moment(currentDay).format('W');
  const endDateWeekIndex = moment(event?.endDate).format('W');
  return endDateWeekIndex !== currentDayWeekIndex;
};
