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

const isEventInDay = (daysWithEvents, eventStartDate, eventDayIndex) => {
  // check whether day of event with index eventDayIndex has been added to daysWithEvents
  return Object.keys(daysWithEvents).includes(
    generateEventDay(eventStartDate, eventDayIndex),
  );
};

const isPreviousEventDayInDay = (
  daysWithEvents,
  eventStartDate,
  eventDayIndex,
  currentEvent,
) => {
  // check whether the previous/first day of the event has been added to daysWithEvents
  return Object.values(
    daysWithEvents[
      `${generateEventDay(
        eventStartDate,
        eventDayIndex > 0 ? eventDayIndex - 1 : eventDayIndex,
      )}`
    ],
  ).includes(currentEvent);
};

// if the event is found on the previous day, then set de index to the same from the previous day
const addEventWithPreviousIndex = (
  daysWithEvents,
  eventStartDate,
  eventDayIndex,
  currentEvent,
) => {
  return {
    ...daysWithEvents,
    // day of daysWithEvents that contains the event
    [`${generateEventDay(eventStartDate, eventDayIndex)}`]: {
      ...daysWithEvents[`${generateEventDay(eventStartDate, eventDayIndex)}`],
      // add the event, having he same index as the previous day
      [`${Object.keys(
        daysWithEvents[
          `${generateEventDay(eventStartDate, eventDayIndex - 1)}`
        ],
      ).pop()}`]: currentEvent,
    },
  };
};

// if the event isn't found on the previous day, then set the index to the last index of the current day + 1
const addEventWithNewIndex = (
  daysWithEvents,
  eventStartDate,
  eventDayIndex,
  currentEvent,
  eventTimeSpan,
) => {
  return {
    ...daysWithEvents,
    // day of daysWithEvents that contains the event
    [`${generateEventDay(eventStartDate, eventDayIndex)}`]: {
      ...daysWithEvents[`${generateEventDay(eventStartDate, eventDayIndex)}`],
      // add the event, having the next free index
      [nextFreeIndex(
        eventTimeSpan,
        daysWithEvents,
        eventStartDate,
      )]: currentEvent,
    },
  };
};

// const addDayNewEventOld = (daysWithEvents, eventStartDate, eventDayIndex, currentEvent) => {
//   return {
//     ...daysWithEvents,
//     [`${generateEventDay(eventStartDate, eventDayIndex)}`]: {
//       [`${Object.keys(
//         daysWithEvents[`${generateEventDay(eventStartDate, eventDayIndex - 1)}`],
//       ).pop()}`]: currentEvent,
//     },
//   };
// };

// const addDayNewEventNew = (
//   daysWithEvents,
//   eventStartDate,
//   eventDayIndex,
//   currentEvent,
//   eventTimeSpan,
// ) => {
//   return {
//     ...daysWithEvents,
//     [`${generateEventDay(eventStartDate, eventDayIndex)}`]: {
//       [nextFreeIndex(eventTimeSpan, daysWithEvents, eventStartDate)]: currentEvent,
//     },
//   };
// };

const isEventFromPreviousDay = (
  daysWithEvents,
  eventStartDate,
  index,
  currentEvent,
) => {
  // check if event exists on previous day
  const previousDay =
    daysWithEvents[`${generateEventDay(eventStartDate, index - 1)}`];
  if (previousDay) {
    return Object.values(previousDay).includes(currentEvent);
  }
  return false;
};

const nextFreeIndex = (eventTimeSpan, daysWithEvents, eventStartDate) => {
  const freeIndex = Array(Math.round(eventTimeSpan) + 1)
    .fill(0)
    .reduce((highestIndex, _, index) => {
      // if daysWithEvents contains the day of the event
      if (
        Object.keys(daysWithEvents).includes(
          generateEventDay(eventStartDate, index),
        )
      ) {
        // the highest index is the index of the event in day + 1
        const highestDayIndex =
          parseInt(
            Object.keys(
              daysWithEvents[`${generateEventDay(eventStartDate, index)}`],
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
  return events.reduce((daysWithEvents, currentEvent) => {
    // distance in days between start and end of event
    const eventTimeSpan =
      (new Date(currentEvent.endDate).getTime() -
        new Date(currentEvent.startDate).getTime()) /
      (1000 * 3600 * 24);
    // array with length equal to the number of days the event spans
    const eventDays =
      eventTimeSpan > 0
        ? Array(Math.round(eventTimeSpan) + 1).fill(0)
        : Array(1).fill(0);
    let eventStartDate = new Date(currentEvent.startDate);

    // daysWithEvents is an array of all days that have events, {[day: [events]]}
    eventDays.map(
      (_, eventDayIndex) =>
        // if event exists in current day
        (daysWithEvents = isEventInDay(
          daysWithEvents,
          eventStartDate,
          eventDayIndex,
        )
          ? // if the previous/first day of the event has been added to daysWithEvents
            isPreviousEventDayInDay(
              daysWithEvents,
              eventStartDate,
              eventDayIndex,
              currentEvent,
            )
            ? // add event with index from previous day
              addEventWithPreviousIndex(
                daysWithEvents,
                eventStartDate,
                eventDayIndex,
                currentEvent,
              )
            : // add event with new index
              addEventWithNewIndex(
                daysWithEvents,
                eventStartDate,
                eventDayIndex,
                currentEvent,
                eventTimeSpan,
              )
          : // if event exists on the previous day
          isEventFromPreviousDay(
              daysWithEvents,
              eventStartDate,
              eventDayIndex,
              currentEvent,
            )
          ? // add event with index from the previous day
            addEventWithPreviousIndex(
              daysWithEvents,
              eventStartDate,
              eventDayIndex,
              currentEvent,
            )
          : // add event with new index
            addEventWithNewIndex(
              daysWithEvents,
              eventStartDate,
              eventDayIndex,
              currentEvent,
              eventTimeSpan,
            )),
    );
    return daysWithEvents;
  }, {});
}
