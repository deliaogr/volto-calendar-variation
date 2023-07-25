import moment from 'moment';
import { flattenToAppURL } from '@plone/volto/helpers';
import { rrulestr } from 'rrule';

const calculateCount = (event, rrule, recurrenceEndDate) => {
  let startDate = new Date(event.start);
  const recurrenceDates = rrule.between(startDate, recurrenceEndDate, true);

  // the + 1 adds the template event alongside the generated ones
  return recurrenceDates.length + 1;
};

export const formatEvents = (events) => {
  let formattedEvents = events.map((event) => {
    let freqValue = null;
    let recurrenceCount = null;
    let recurrenceInterval = null;

    if (event.recurrence) {
      const freqIndex = event.recurrence.indexOf('FREQ=');
      const semicolonIndex = event.recurrence.indexOf(';', freqIndex);
      freqValue = event.recurrence.substring(freqIndex + 5, semicolonIndex);

      const rrule = rrulestr(event.recurrence);

      recurrenceInterval = rrule.options.interval || 1;
      const recurrenceEndDate = rrule.options.until || null;

      const calculatedCount = recurrenceEndDate
        ? calculateCount(event, rrule, recurrenceEndDate)
        : null;
      recurrenceCount = rrule.options.count || calculatedCount;
    }

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
      recursive: freqValue ? freqValue.toLowerCase() : 'no',
      recurrenceCount,
      recurrenceInterval,
    };
  });

  return formattedEvents;
};
