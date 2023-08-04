import moment from 'moment';

const generateEventDay = (eventStartDate, index) => {
  // return the ith day of event
  // index can be -1 ?
  const date = new Date(eventStartDate);
  date.setDate(date.getDate() + index);
  const day = new Date(date).getDate();
  const year = new Date(date).getFullYear();
  const month = new Date(date).getMonth() + 1;
  return moment(new Date(`${month}, ${day}, ${year}`)).format('YYYY-MM-DD');
};

const isEventInDay = (daysWithEventsAcc, eventStartDate, eventDayIndex) => {
  // check whether day of event with index eventDayIndex has been added to daysWithEventsAcc
  return Object.keys(daysWithEventsAcc).includes(
    generateEventDay(eventStartDate, eventDayIndex),
  );
};

const isPreviousEventDayAdded = (
  daysWithEventsAcc,
  eventStartDate,
  eventDayIndex,
  currentEvent,
) => {
  const previousEventDay = `${generateEventDay(
    eventStartDate,
    eventDayIndex > 0 ? eventDayIndex - 1 : eventDayIndex,
  )}`;
  return Object.values(daysWithEventsAcc[previousEventDay] || {}).includes(
    currentEvent,
  );
};

// if the event is found on the previous day, then set de index to the same from the previous day
const addEventWithPreviousIndex = (
  daysWithEventsAcc,
  eventStartDate,
  eventDayIndex,
  currentEvent,
) => {
  const currentDay = `${generateEventDay(eventStartDate, eventDayIndex)}`;
  const previousDay = generateEventDay(eventStartDate, eventDayIndex - 1);
  const previousDayIndex = `${Object.keys(
    daysWithEventsAcc[`${previousDay}`],
  ).pop()}`;

  return {
    [currentDay]: {
      ...daysWithEventsAcc[currentDay],
      [previousDayIndex]: currentEvent,
    },
  };
};

// if the event isn't found on the previous day, then set the index to the last index of the current day + 1
const addEventWithNewIndex = (
  daysWithEventsAcc,
  eventStartDate,
  eventDayIndex,
  currentEvent,
  eventTimeSpan,
) => {
  const currentDay = `${generateEventDay(eventStartDate, eventDayIndex)}`;
  const nextIndex = nextFreeIndex(
    eventTimeSpan,
    daysWithEventsAcc,
    eventStartDate,
  );

  return {
    [currentDay]: {
      ...daysWithEventsAcc[currentDay],
      [nextIndex]: currentEvent,
    },
  };
};

const isEventFromPreviousDay = (
  daysWithEventsAcc,
  eventStartDate,
  index,
  currentEvent,
) => {
  // check if event exists on previous day
  const previousDay =
    daysWithEventsAcc[`${generateEventDay(eventStartDate, index - 1)}`];
  if (previousDay) {
    return Object.values(previousDay).includes(currentEvent);
  }
  return false;
};

const nextFreeIndex = (eventTimeSpan, daysWithEventsAcc, eventStartDate) => {
  const freeIndex = Array(Math.round(eventTimeSpan) + 1)
    .fill(0)
    .reduce((highestIndex, _, index) => {
      // if daysWithEventsAcc contains the day of the event
      if (
        Object.keys(daysWithEventsAcc).includes(
          generateEventDay(eventStartDate, index),
        )
      ) {
        // the highest index is the index of the event in day + 1
        const highestDayIndex =
          parseInt(
            Object.keys(
              daysWithEventsAcc[`${generateEventDay(eventStartDate, index)}`],
            ).pop(),
          ) + 1;
        return highestDayIndex > highestIndex ? highestDayIndex : highestIndex;
      } else {
        return highestIndex;
      }
    }, 0);
  return freeIndex;
};

/**
 * will iterate over events, generate properties for each day with at least an event
 * if day already exists, will add event with a new index
 * @param {Object[]} events
 * @returns {'YYYY-MM-DD': {0: event, 1: event, ...}}
 */
export default function eventsMatrix(events) {
  return events.reduce((daysWithEventsAcc, currentEvent) => {
    // distance in days between start and end of event
    const eventTimeSpan =
      (new Date(currentEvent.endDate).getTime() -
        new Date(currentEvent.startDate).getTime()) /
      (1000 * 3600 * 24);
    // array with length equal to the number of days the event spans
    const daysOfEvent =
      eventTimeSpan > 0
        ? Array(Math.round(eventTimeSpan) + 1).fill(0)
        : Array(1).fill(0);
    let eventStartDate = new Date(currentEvent.startDate);

    // daysWithEventsAcc is an array of all days that have events, {'YYYY-MM-DD': {0: event, 1: event, ...}}
    const result = daysOfEvent.reduce((eventDayAcc, _, eventDayIndex) => {
      // if event exists in current day
      const eventDay = isEventInDay(
        daysWithEventsAcc,
        eventStartDate,
        eventDayIndex,
      )
        ? // if the previous/first day of the event has been added to daysWithEventsAcc
          isPreviousEventDayAdded(
            daysWithEventsAcc,
            eventStartDate,
            eventDayIndex,
            currentEvent,
          )
          ? addEventWithPreviousIndex(
              daysWithEventsAcc,
              eventStartDate,
              eventDayIndex,
              currentEvent,
            )
          : addEventWithNewIndex(
              daysWithEventsAcc,
              eventStartDate,
              eventDayIndex,
              currentEvent,
              eventTimeSpan,
            )
        : // if event exists on the previous day
        isEventFromPreviousDay(
            daysWithEventsAcc,
            eventStartDate,
            eventDayIndex,
            currentEvent,
          )
        ? addEventWithPreviousIndex(
            daysWithEventsAcc,
            eventStartDate,
            eventDayIndex,
            currentEvent,
          )
        : addEventWithNewIndex(
            daysWithEventsAcc,
            eventStartDate,
            eventDayIndex,
            currentEvent,
            eventTimeSpan,
          );
      return { ...eventDayAcc, ...eventDay };
    }, {});
    return { ...daysWithEventsAcc, ...result };
  }, {});
}
