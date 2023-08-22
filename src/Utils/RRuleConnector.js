import moment from 'moment';
import { rrulestr, RRule, RRuleSet } from 'rrule';

function getWeekNumber(date) {
  const currentDate = new Date(date.getTime());
  currentDate.setHours(0, 0, 0, 0);

  const firstDayOfYear = new Date(currentDate.getFullYear(), 0, 1);
  const daysOffset =
    firstDayOfYear.getDay() === 0 ? 1 : 8 - firstDayOfYear.getDay();

  const daysPassed = Math.floor((currentDate - firstDayOfYear) / 86400000) + 1;

  return Math.ceil((daysPassed - daysOffset) / 7);
}

function getDayOfYear(date) {
  const startOfYear = new Date(date.getFullYear(), 0, 0);
  const diff = date - startOfYear;
  const oneDay = 1000 * 3600 * 24;
  return Math.floor(diff / oneDay);
}

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
    id: event.id,
    recursive: 'no',
  };
};

const isRelevant = (event, interval) => {
  const eventStartDateTime = new Date(event.start).getTime();
  const eventEndDateTime = new Date(event.end).getTime();
  const intervalStartDate = new Date(interval.startDate).setHours(0, 0, 0, 0);
  const intervalStartDateTime = new Date(intervalStartDate).getTime();
  const intervalEndDate = new Date(interval.endDate).setHours(23, 59, 59, 999);
  const intervalEndDateTime = new Date(intervalEndDate).getTime();

  const eventStartsInInterval =
    eventStartDateTime >= intervalStartDateTime &&
    eventStartDateTime <= intervalEndDateTime;

  const eventEndsInInterval =
    eventEndDateTime >= intervalStartDateTime &&
    eventEndDateTime <= intervalEndDateTime;

  const eventIncludesInterval =
    eventStartDateTime <= intervalStartDateTime &&
    eventEndDateTime >= intervalEndDateTime;

  const isRelevant =
    eventStartsInInterval || eventEndsInInterval || eventIncludesInterval;

  return isRelevant;
};

const updateRRule = (rrule, eventStartDate) => {
  return new RRule({
    ...rrule.options,
    dtstart: eventStartDate,
    byhour: rrule.options.byhour?.length ? [eventStartDate.getHours()] : [],
    byminute: rrule.options.byminute?.length
      ? [eventStartDate.getMinutes()]
      : [],
    bymonth: rrule.options.bymonth?.length
      ? [eventStartDate.getMonth() + 1]
      : [],
    bymonthday: rrule.options.bymonthday?.length
      ? [eventStartDate.getDate()]
      : [],
    bynmonthday: rrule.options.bynthmonthday?.length
      ? [eventStartDate.getDate()]
      : [],
    bynweekday: rrule.options.bynthweekday?.length
      ? [eventStartDate.getDay() === 0 ? 6 : eventStartDate.getDay() - 1]
      : [],
    bysecond: rrule.options.bysecond?.length
      ? [eventStartDate.getSeconds()]
      : [],
    bysetpos: rrule.options.bysetpos?.length ? [eventStartDate.getDate()] : [],
    byweekday: rrule.options.byweekday?.length
      ? [eventStartDate.getDay() === 0 ? 6 : eventStartDate.getDay() - 1]
      : [],
    byweekno: rrule.options.byweekno?.length
      ? [getWeekNumber(eventStartDate)]
      : [],
    byyearday: rrule.options.byyearday?.length
      ? [getDayOfYear(eventStartDate)]
      : [],
  });
};

const formatRecursiveRelevantEvents = (event, interval) => {
  const rruleSet = rrulestr(event.recurrence);
  const isRRuleSet = rruleSet instanceof RRuleSet;
  const isRRule = rruleSet instanceof RRule;
  const eventStartDate = new Date(event.start);

  const clonedRRuleSet = new RRuleSet();
  if (isRRule && !isRRuleSet) {
    const clonedRRule = updateRRule(rruleSet, eventStartDate);
    clonedRRuleSet.rrule(clonedRRule);
  } else if (isRRuleSet) {
    rruleSet.rrules().forEach((rrule) => {
      const clonedRRule = updateRRule(rrule, eventStartDate);
      clonedRRuleSet.rrule(clonedRRule);
    });
  }

  const firstRecursiveEvent = {
    ...makeDefaultEvent(event),
    ...addRecurrenceProperty(event),
  };

  const eventTimeSpan =
    new Date(firstRecursiveEvent.endDate).getTime() -
    new Date(firstRecursiveEvent.startDate).getTime();

  const allRecurrenceDates = clonedRRuleSet.all();

  const relevantRecurrenceDates = allRecurrenceDates.filter((date) =>
    isRelevant(
      { start: date, end: new Date(date.getTime() + eventTimeSpan) },
      interval,
    ),
  );

  if (relevantRecurrenceDates.length === 0) return [];

  // recurrenceDates is an array of all dates generated using the recurrence rule
  // but only the startDate
  // we use the original event and only update the start and end dates for each recurrent event
  return relevantRecurrenceDates.map((date, index) => {
    const startDate = date;
    const endDate = new Date(startDate.getTime() + eventTimeSpan);
    return {
      ...firstRecursiveEvent,
      startDate: moment(startDate).format('YYYY-MM-DD'),
      endDate: moment(endDate).format('YYYY-MM-DD'),
      recurrenceIndex: index,
    };
  });
};

const formatDefaultRelevantEvent = (event, interval) => {
  return isRelevant(event, interval) ? [makeDefaultEvent(event)] : [];
};

export const formatEventsForInterval = (events = [], interval) => {
  return events.reduce((acc, currentEvent) => {
    const result = !currentEvent.recurrence
      ? formatDefaultRelevantEvent(currentEvent, interval)
      : formatRecursiveRelevantEvents(currentEvent, interval);
    return [...acc, ...result];
  }, []);
};

export const addExceptionDate = (event, date) => {
  const rruleSet = rrulestr(event.recurrence);
  rruleSet.exdate(date);
  console.log({ rruleSet });
  return {
    ...event,
    recurrence: rruleSet.toString(),
  };
};
