import moment from 'moment';

// generateDayOfEvent
const addToStartDate = (eventStartDate, index) => {
  // add number of days to event start date, return each day of event
  // index represents the ith day of the event, can be -1 ?
  const date = new Date(eventStartDate);
  date.setDate(date.getDate() + index);
  const day = new Date(date).getDate();
  const year = new Date(date).getFullYear();
  const month = new Date(date).getMonth() + 1;
  return moment(new Date(`${month}, ${day}, ${year}`)).format('YYYY-MM-DD');
};

// isEventInDay
const isDayOld = (acc, eventStartDate, diffDayIndex) => {
  // check whether day of event with index diffDayIndex has been added to acc
  return Object.keys(acc).includes(
    addToStartDate(eventStartDate, diffDayIndex),
  );
};

// isPreviousEventDayInDay
const isDayOldEventOld = (acc, eventStartDate, diffDayIndex, currentEvent) => {
  // check whether the previous/first day of the event has been added to acc
  return Object.values(
    acc[
      `${addToStartDate(
        eventStartDate,
        diffDayIndex > 0 ? diffDayIndex - 1 : diffDayIndex,
      )}`
    ],
  ).includes(currentEvent);
};

// if the event is found on the previous day, then set de index to the same from the previous day
// addEventWithPreviousIndex
const addDayOldEventOld = (acc, eventStartDate, diffDayIndex, currentEvent) => {
  return {
    ...acc,
    // day of acc that contains the event
    [`${addToStartDate(eventStartDate, diffDayIndex)}`]: {
      ...acc[`${addToStartDate(eventStartDate, diffDayIndex)}`],
      // add the event, having he same index as the previous day
      [`${Object.keys(
        acc[`${addToStartDate(eventStartDate, diffDayIndex - 1)}`],
      ).pop()}`]: currentEvent,
    },
  };
};

// if the event isn't found on the previous day, then set the index to the last index of the current day + 1
// addEventWithNewIndex
const addDayOldEventNew = (
  acc,
  eventStartDate,
  diffDayIndex,
  currentEvent,
  startEndDateDiff,
) => {
  return {
    ...acc,
    // day of acc that contains the event
    [`${addToStartDate(eventStartDate, diffDayIndex)}`]: {
      ...acc[`${addToStartDate(eventStartDate, diffDayIndex)}`],
      // add the event, having the next free index
      [nextFreeIndex(startEndDateDiff, acc, eventStartDate)]: currentEvent,
    },
  };
};

// this function is almost the same as addDayOldEventOld, maybe merge them ?
const addDayNewEventOld = (acc, eventStartDate, diffDayIndex, currentEvent) => {
  return {
    ...acc,
    [`${addToStartDate(eventStartDate, diffDayIndex)}`]: {
      [`${Object.keys(
        acc[`${addToStartDate(eventStartDate, diffDayIndex - 1)}`],
      ).pop()}`]: currentEvent,
    },
  };
};

// this function is almost the same as addDayOldEventNew, maybe merge them ?
const addDayNewEventNew = (
  acc,
  eventStartDate,
  diffDayIndex,
  currentEvent,
  startEndDateDiff,
) => {
  return {
    ...acc,
    [`${addToStartDate(eventStartDate, diffDayIndex)}`]: {
      [nextFreeIndex(startEndDateDiff, acc, eventStartDate)]: currentEvent,
    },
  };
};

// isEventFromPreviousDay
const isDayNewEventOld = (acc, eventStartDate, index, currentEvent) => {
  // check if event exists on previous day
  const a = acc[`${addToStartDate(eventStartDate, index - 1)}`];
  if (a) {
    return Object.values(a).includes(currentEvent);
  } else {
    return false;
  }
};

const nextFreeIndex = (startEndDateDiff, eventsMatrixDay, eventStartDate) => {
  // eventsMatrixDay = acc ?
  // array with a length equal to the number of days the event spans
  const freeIndex = Array(Math.round(startEndDateDiff) + 1)
    .fill(0)
    .reduce((highestIndex, _, index) => {
      // if acc contains the day of the event
      if (
        Object.keys(eventsMatrixDay).includes(
          addToStartDate(eventStartDate, index),
        )
      ) {
        // the highest index is the index of the day with the event + 1
        const highestDayIndex =
          parseInt(
            Object.keys(
              eventsMatrixDay[`${addToStartDate(eventStartDate, index)}`],
            ).pop(),
          ) + 1;
        return highestDayIndex > highestIndex ? highestDayIndex : highestIndex;
      } else {
        return highestIndex;
      }
    }, 0);
  return freeIndex;
};

export default function eventsMatrix(events) {
  return events.reduce((acc, currentEvent) => {
    // distance in days between start and end of event
    const startEndDateDiff =
      (new Date(currentEvent.endDate).getTime() -
        new Date(currentEvent.startDate).getTime()) /
      (1000 * 3600 * 24);
    // array with length equal to the number of days the event spans
    const diffArray =
      startEndDateDiff > 0
        ? Array(Math.round(startEndDateDiff) + 1).fill(0)
        : Array(1).fill(0);
    let eventStartDate = new Date(currentEvent.startDate);

    // acc is an array of all days that have events, {[day: [events]]}
    // diffDayIndex is number of days an event spans
    diffArray.map(
      (_, diffDayIndex) =>
        // if event exists in current day
        (acc = isDayOld(acc, eventStartDate, diffDayIndex)
          ? // if the previous/first day of the event has been added to acc
            isDayOldEventOld(acc, eventStartDate, diffDayIndex, currentEvent)
            ? // add event with index from previous day
              addDayOldEventOld(acc, eventStartDate, diffDayIndex, currentEvent)
            : // add event with new index
              addDayOldEventNew(
                acc,
                eventStartDate,
                diffDayIndex,
                currentEvent,
                startEndDateDiff,
              )
          : // if event exists on the previous day
          isDayNewEventOld(acc, eventStartDate, diffDayIndex, currentEvent)
          ? // add event with index from the previous day
            addDayNewEventOld(acc, eventStartDate, diffDayIndex, currentEvent)
          : // add event with new index
            addDayNewEventNew(
              acc,
              eventStartDate,
              diffDayIndex,
              currentEvent,
              startEndDateDiff,
            )),
    );
    return acc;
  }, {});
}
