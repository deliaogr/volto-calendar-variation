// import { recursiveEventsInInterval } from '../Calendar/views/month/recursiveEventsInInterval';
import { recursiveFunctions } from '../Calendar/views/helpers/recursiveFunctions';

export const recursiveEventsTool = (recursiveEvents, selectedInterval) => {
  //   const relevantRecursiveEvents = recursiveEvents.filter((event) =>
  //     recursiveEventsInInterval(event, selectedInterval),
  //   );

  const relevantRecursiveEvents = recursiveEvents.filter(
    (event) =>
      new Date(event.startDate).getTime() <
        new Date(selectedInterval.endDate).getTime() &&
      new Date(event.recurrenceEndDate) > new Date(selectedInterval.startDate),
  );

  const allRecursiveEvents = relevantRecursiveEvents.reduce(
    (acc, currentEvent) => {
      return [
        ...acc,
        ...recursiveFunctions[currentEvent.recursive](
          currentEvent,
          selectedInterval,
        ),
      ];
    },
    [],
  );

  return allRecursiveEvents;
};
