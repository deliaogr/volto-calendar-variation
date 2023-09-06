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
    byhour: rrule.options.byhour?.length ? [eventStartDate.getHours()] : null,
    byminute: rrule.options.byminute?.length
      ? [eventStartDate.getMinutes()]
      : null,
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
      : null,
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
  let rruleSet = rrulestr(event.recurrence);
  const isRRuleSet = rruleSet instanceof RRuleSet;
  const eventStartDate = new Date(event.start);

  const exDates = rruleSet._exdate || [];
  exDates.forEach((exDate) => {
    rruleSet.exdate(exDate);
  });

  if (!isRRuleSet) {
    rruleSet = updateRRule(rruleSet, eventStartDate);
  } else {
    rruleSet.rrules().forEach((rrule) => {
      rruleSet = updateRRule(rrule, eventStartDate);
    });
  }

  const firstRecursiveEvent = {
    ...makeDefaultEvent(event),
    ...addRecurrenceProperty(event),
  };

  const eventTimeSpan =
    new Date(firstRecursiveEvent.endDate).getTime() -
    new Date(firstRecursiveEvent.startDate).getTime();

  const allRecurrenceDates = rruleSet.all().filter((date) => {
    const shouldIncludeDate = exDates.every((exDate) => {
      const normalizedExDate = new Date(exDate);
      normalizedExDate.setHours(0, 0, 0, 0);
      date.setHours(0, 0, 0, 0);
      return normalizedExDate.toISOString() !== date.toISOString();
    });
    return shouldIncludeDate;
  });

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
  const rrule = rrulestr(event.recurrence);
  const exDate = new Date(date);
  const isRRuleSet = rrule instanceof RRuleSet;
  if (!isRRuleSet) {
    const rruleSet = new RRuleSet();
    rruleSet.rrule(rrule);
    rruleSet.exdate(exDate);
    return {
      ...event,
      recurrence: rruleSet.toString(),
    };
  } else {
    rrule.exdate(exDate);
    return {
      ...event,
      recurrence: rrule.toString(),
    };
  }
};

export const updateRecurrenceEnd = (event, date) => {
  let rruleSet = rrulestr(event.recurrence);
  const endDate = new Date(date);
  endDate.setDate(date.getDate() - 1);
  endDate.setHours(23, 59, 59, 999);
  const isRRuleSet = rruleSet instanceof RRuleSet;

  if (!isRRuleSet) {
    rruleSet = new RRule({
      ...rruleSet.options,
      until: endDate,
      count: null,
    });
  } else {
    rruleSet.rrules().forEach((rrule) => {
      rrule = new RRule({
        ...rrule.options,
        until: endDate,
        count: null,
      });
    });
  }

  return rruleSet.toString();
};

const calculateCountIfUntil = (startDate, recurrenceEndDate, rrule) => {
  return rrule.between(startDate, recurrenceEndDate).length;
};

const calculateCountIfCount = (eventStartDate, newStartDate, rrule) => {
  const initialCount = rrule.all().length;
  const newCount = rrule.between(eventStartDate, newStartDate, true).length;
  return newCount > 1 ? initialCount - newCount + 1 : initialCount - 1;
};

export const updateRecurrenceStart = (event, date) => {
  let rruleSet = rrulestr(event.recurrence);
  const eventStartDate = new Date(event.start);
  const startDate = new Date(date);
  const until = new Date(rruleSet.options.until);
  const count = rruleSet.options.until
    ? calculateCountIfUntil(startDate, until, rruleSet)
    : calculateCountIfCount(eventStartDate, startDate, rruleSet);

  const isRRuleSet = rruleSet instanceof RRuleSet;

  if (!isRRuleSet) {
    rruleSet = updateRRule(rruleSet, startDate);
    rruleSet = new RRule({
      ...rruleSet.options,
      count: count,
      until: null,
    });
  } else {
    rruleSet.rrules().forEach((rrule) => {
      rrule = updateRRule(rrule, startDate);
      rruleSet = new RRule({
        ...rruleSet.options,
        count: count,
        until: null,
      });
    });
  }

  return rruleSet.toString();
};
