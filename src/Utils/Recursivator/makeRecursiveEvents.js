import { generateRecursiveEvents } from './generateRecursiveEvents';

export const makeRecursiveEvents = (eventTemplates, interval) => {
  // we create new events based on the recursion rules of each event
  const recursiveEvents = eventTemplates.reduce((acc, eventTemplate) => {
    // ex: daily, weekly, monthly
    const recursionType = eventTemplate.recursive;
    return [
      ...acc,
      ...generateRecursiveEvents[recursionType](eventTemplate, interval),
    ];
  }, []);

  return recursiveEvents;
};
