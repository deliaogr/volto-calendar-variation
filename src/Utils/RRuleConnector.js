import moment from 'moment';
import { flattenToAppURL } from '@plone/volto/helpers';
import { rrulestr } from 'rrule';

/**
 *
 * @param {Object} event
 * @param {string} event.recurrence
 * @returns {Object}
 */
// TODO: consider returning recurrence also
const addRecurrenceProperty = (event) => {
  if (!event.recurrence) return {};

  const freqIndex = event.recurrence.indexOf('FREQ=');
  const semicolonIndex = event.recurrence.indexOf(';', freqIndex);
  const recursionType = event.recurrence.substring(
    freqIndex + 5,
    semicolonIndex,
  );
  const recursive = recursionType.toLowerCase();

  return { recursive };
};

const makeDefaultEvent = (event) => {
  const startDateTime = new Date(event.start);
  const endDateTime = new Date(event.end);
  const startHour = startDateTime.getHours().toString().padStart(2, '0');
  const startMinutes = startDateTime.getMinutes().toString().padStart(2, '0');
  const endHour = endDateTime.getHours().toString().padStart(2, '0');
  const endMinutes = endDateTime.getMinutes().toString().padStart(2, '0');

  const isFullDayEvent = event.whole_day ? true : false;

  return {
    title: event.title,
    startDate: moment(startDateTime).format('YYYY-MM-DD'),
    endDate: moment(endDateTime).format('YYYY-MM-DD'),
    startHour: isFullDayEvent ? null : `${startHour}:${startMinutes}`,
    endHour: isFullDayEvent ? null : `${endHour}:${endMinutes}`,
    url: flattenToAppURL(event['@id']),
    id: Math.floor(Math.random() * 100),
    recursive: 'no',
  };
};

const formatRecursiveRelevantEvents = (event, interval) => {
  const rrule = rrulestr(event.recurrence);

  const recurrenceDates = rrule.between(
    interval.startDate.toDate(),
    interval.endDate.toDate(),
  );

  if (recurrenceDates.length === 0) return [];

  const firstRecursiveEvent = {
    ...makeDefaultEvent(event),
    ...addRecurrenceProperty(event),
  };

  const eventTimeSpan =
    new Date(firstRecursiveEvent.endDate).getTime() -
    new Date(firstRecursiveEvent.startDate).getTime();

  // recurrenceDates is an array of all dates generated using the recurrence rule
  // but only the startDate
  // we use the original event and only update the start and end dates for each recurrent event
  return recurrenceDates.map((date) => {
    const startDate = date;
    const endDate = new Date(startDate.getTime() + eventTimeSpan);
    return {
      ...firstRecursiveEvent,
      startDate: moment(startDate).format('YYYY-MM-DD'),
      endDate: moment(endDate).format('YYYY-MM-DD'),
    };
  });
};

const formatDefaultRelevantEvent = (event, interval) => {
  const isRelevant = moment(event.start).isBetween(
    interval.startDate,
    interval.endDate,
    undefined,
    '[]',
  );

  return isRelevant ? [makeDefaultEvent(event)] : [];
};

export const formatEventsForInterval = (events = [], interval) => {
  return events.reduce((acc, currentEvent) => {
    const result = !currentEvent.recurrence
      ? formatDefaultRelevantEvent(currentEvent, interval)
      : formatRecursiveRelevantEvents(currentEvent, interval);
    return [...acc, ...result];
  }, []);
};
