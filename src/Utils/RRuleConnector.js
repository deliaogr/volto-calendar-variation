import moment from 'moment';
import { rrulestr, RRule, RRuleSet } from 'rrule';

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

const formatRecursiveRelevantEvents = (event, interval) => {
  const rruleSet = rrulestr(event.recurrence);
  const eventStartDate = new Date(event.start);

  const clonedRuleSet = new RRuleSet();
  rruleSet.rrules().forEach((rrule) => {
    const clonedRule = new RRule({
      ...rrule.options,
      dtstart: eventStartDate,
      byhour: rrule.options.byhour.length ? eventStartDate.getHours() : [],
      // rrule expects monday to be 0, while Date sets sunday as 0
      byweekday: rrule.options.byweekday ? eventStartDate.getDay() - 1 : null,
      bymonthday: rrule.options.bymonthday.length
        ? eventStartDate.getDate()
        : [],
      bymonth: rrule.options.bymonth ? eventStartDate.getDate() : null,
    });
    clonedRuleSet.rrule(clonedRule);
  });

  const firstRecursiveEvent = {
    ...makeDefaultEvent(event),
    ...addRecurrenceProperty(event),
  };

  const eventTimeSpan =
    new Date(firstRecursiveEvent.endDate).getTime() -
    new Date(firstRecursiveEvent.startDate).getTime();

  const allRecurrenceDates = clonedRuleSet.all();
  console.log({ allRecurrenceDates, firstRecursiveEvent });

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
  return relevantRecurrenceDates.map((date) => {
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
