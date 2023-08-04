export const eventTimeSpan = (endDate, date) => {
  const extensionDiff =
    (new Date(endDate).getTime() - new Date(date).getTime()) /
    (1000 * 3600 * 24);
  const isSunday = new Date(date).getDay() === 0;
  const moreThanOneWeek = extensionDiff > 7 - new Date(date).getDay();
  return isSunday
    ? 1
    : moreThanOneWeek
    ? 7 - new Date(date).getDay() + 1
    : extensionDiff + 1;
};

export const makeEventWidth = (event, date) => {
  return event
    ? eventTimeSpan(event.endDate, date) * 100 +
        5.5 * (eventTimeSpan(event.endDate, date) - 1)
    : 0;
};
