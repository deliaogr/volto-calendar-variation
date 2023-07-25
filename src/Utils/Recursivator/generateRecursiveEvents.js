import moment from 'moment';

const getEventDetails = (eventTemplate) => {
  const eventStartDate = new Date(eventTemplate.startDate);
  const eventEndDate = new Date(eventTemplate.endDate);
  const recurrenceInterval = eventTemplate.recurrenceInterval;
  const recurrenceCount = eventTemplate.recurrenceCount;

  return {
    eventStartDate,
    eventEndDate,
    recurrenceCount,
    recurrenceInterval,
  };
};

// number of days between start and end of event
const eventTimeSpan = (event) => {
  return (
    (new Date(event.endDate).getTime() - new Date(event.startDate).getTime()) /
    (1000 * 3600 * 24)
  );
};

const createEventEndDate = (eventStartDate, eventTemplate) => {
  return (
    eventStartDate.getTime() + eventTimeSpan(eventTemplate) * 24 * 3600 * 1000
  );
};

const formatEvent = (eventTemplate, eventStartDate, eventEndDate) => {
  return {
    ...eventTemplate,
    startDate: moment(eventStartDate).format('YYYY-MM-DD'),
    endDate: moment(eventEndDate).format('YYYY-MM-DD'),
  };
};

// weekly, monthly refer to recursion type, not view
export const generateRecursiveEvents = {
  daily(eventTemplate) {
    const {
      eventStartDate,
      eventEndDate,
      // the number of events to be generated
      recurrenceCount,
      // represents the number of months between two consecutive events
      recurrenceInterval,
    } = getEventDetails(eventTemplate);

    const generatedEvents = Array(recurrenceCount)
      .fill(0)
      .map((_, index) => {
        if (index > 0) {
          eventStartDate.setTime(
            eventStartDate.getTime() + 24 * 3600 * 1000 * recurrenceInterval,
          );
        }
        eventEndDate.setTime(createEventEndDate(eventStartDate, eventTemplate));
        return formatEvent(eventTemplate, eventStartDate, eventEndDate);
      });

    return generatedEvents;
  },

  weekly(eventTemplate) {
    const {
      eventStartDate,
      eventEndDate,
      recurrenceCount,
      recurrenceInterval,
    } = getEventDetails(eventTemplate);

    const generatedEvents = Array(recurrenceCount)
      .fill(0)
      .map((_, index) => {
        if (index > 0) {
          eventStartDate.setTime(
            eventStartDate.getTime() +
              7 * 24 * 3600 * 1000 * recurrenceInterval,
          );
        }

        // By default, the time is set to 00:00,
        // but in the last weekend of every october the clocks are set back one hour
        // (and that would put the events on the previous day, if we don't change the default hour)
        eventStartDate.setHours(1, 0, 0, 0);
        eventEndDate.setTime(createEventEndDate(eventStartDate, eventTemplate));
        return formatEvent(eventTemplate, eventStartDate, eventEndDate);
      });

    return generatedEvents;
  },

  monthly(eventTemplate) {
    const {
      eventStartDate,
      eventEndDate,
      recurrenceCount,
      recurrenceInterval,
    } = getEventDetails(eventTemplate);

    const generatedEvents = Array(recurrenceCount)
      .fill(0)
      .map((_, index) => {
        if (index > 0) {
          let newYear = eventStartDate.getFullYear();
          let newMonth = eventStartDate.getMonth() + recurrenceInterval;

          // how many years need to be added based on the number of months added to the new month
          newYear += Math.floor((newMonth - 1) / 12);
          // to ensure that the new month is between 1 and 12
          newMonth = ((newMonth - 1) % 12) + 1;

          const newStartDate = new Date(
            newYear,
            newMonth,
            eventStartDate.getDate(),
          );
          eventStartDate.setTime(newStartDate.getTime());
        }

        eventEndDate.setTime(createEventEndDate(eventStartDate, eventTemplate));
        return formatEvent(eventTemplate, eventStartDate, eventEndDate);
      });

    return generatedEvents;
  },

  annually(eventTemplate) {
    const {
      eventStartDate,
      eventEndDate,
      recurrenceCount,
      recurrenceInterval,
    } = getEventDetails(eventTemplate);

    const generatedEvents = Array(recurrenceCount)
      .fill(0)
      .map((_, index) => {
        if (index > 0) {
          eventStartDate.setFullYear(
            eventStartDate.getFullYear() + recurrenceInterval,
          );
        }
        eventEndDate.setTime(createEventEndDate(eventStartDate, eventTemplate));
        return formatEvent(eventTemplate, eventStartDate, eventEndDate);
      });

    return generatedEvents;
  },
};
