import { recursiveFunctions } from './recursiveFunctions';

export const recursiveEventsTool = (recursiveEvents, selectedInterval) => {

  // we filter all recursive events in order to get the ones that start before the interval ends and end after the interval starts
  const relevantRecursiveEvents = recursiveEvents.filter(
    (event) =>
      new Date(event.startDate).getTime() <
        new Date(selectedInterval.endDate).getTime() &&
      new Date(event.recurrenceEndDate) > new Date(selectedInterval.startDate),
  );

  // we create new events based on the recursion rules of each event
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
