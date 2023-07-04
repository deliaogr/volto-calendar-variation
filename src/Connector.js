import moment from 'moment';
import { flattenToAppURL } from '@plone/volto/helpers';
import { rrulestr } from 'rrule';

export const formatEvents = (events) => {
  let formattedEvents = events.map((event) => {
    let freqValue = null;
    let recurrenceEndDate = null;
    let recurrenceInterval = null;

    if (event.recurrence) {
      const freqIndex = event.recurrence.indexOf('FREQ=');
      const semicolonIndex = event.recurrence.indexOf(';', freqIndex);
      freqValue = event.recurrence.substring(freqIndex + 5, semicolonIndex);

      const rrule = rrulestr(event.recurrence);

      recurrenceInterval = rrule.options.interval || null;
      const recurrenceCount = rrule.options.count || null;

      const timeIncrementValue =
        freqValue === 'monthly' ? 'M' : freqValue.slice(0, 1).toLowerCase();

      const calculatedEndDate =
        recurrenceCount &&
        moment(new Date(event.end)).add(
          recurrenceInterval * recurrenceCount - 1,
          timeIncrementValue,
        );

      recurrenceEndDate =
        rrule.options.until || calculatedEndDate.toDate() || null;
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
      recurrenceEndDate: moment(recurrenceEndDate).format('YYYY-MM-DD') || null,
      recurrenceInterval: recurrenceInterval || 1,
    };
  });

  return formattedEvents;
};
