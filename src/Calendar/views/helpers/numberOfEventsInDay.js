export const numberOfEventsInDay = (eventsMatrix, date) => {
  return eventsMatrix[date]
    ? parseInt(Object.keys(eventsMatrix[date]).sort().reverse()[0]) + 1
    : 0;
};
