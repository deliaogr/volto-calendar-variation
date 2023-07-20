import moment from 'moment';

// difference between start of event and start of interval
const startDateEventStartDateIntervalDiff = (interval, event) => {
  const intervalStartTime = new Date(interval.startDate).getTime();
  const eventStartTime = new Date(event.startDate).getTime();
  const result = (intervalStartTime - eventStartTime) / (1000 * 3600 * 24);
  // return result > -7 ? result : -7;
  return result;
};

// day in week index: Monday is 0, Sunday is 6
const currentEventWeekIndex = (event) => {
  const result =
    new Date(event.startDate).getDay() === 0
      ? 6
      : new Date(event.startDate).getDay() - 1;
  return result;
};

// create start date for the event
const makeStartDate = (eventTemplate, interval) => {
  const eventStartDate = new Date(eventTemplate.startDate);
  const eventEndDate = new Date(eventTemplate.endDate);
  const recurrenceEndDate = new Date(eventTemplate.recurrenceEndDate) || null;
  const recurrenceInterval = eventTemplate.recurrenceInterval;

  // calculate event start date in current interval
  eventStartDate.setTime(
    eventStartDate.getTime() +
      (startDateEventStartDateIntervalDiff(interval, eventTemplate) > 0
        ? startDateEventStartDateIntervalDiff(interval, eventTemplate) +
          currentEventWeekIndex(eventTemplate)
        : 0) *
        24 *
        3600 *
        1000,
  );
  return {
    eventStartDate,
    eventEndDate,
    recurrenceEndDate,
    recurrenceInterval,
  };
};

// number of days between start and end of event
const startDateEndDateDiff = (event) => {
  const result =
    (new Date(event.endDate).getTime() - new Date(event.startDate).getTime()) /
    (1000 * 3600 * 24);
  return result;
};

export const generateRecursiveEvents = {
  weekly(eventTemplate, interval) {
    const {
      eventStartDate,
      eventEndDate,
      recurrenceEndDate,
      recurrenceInterval,
    } = makeStartDate(eventTemplate, interval);

    const generatedRecursiveEvents = [];

    // create first event
    eventStartDate.setTime(eventStartDate.getTime());
    eventEndDate.setTime(
      eventStartDate.getTime() +
        startDateEndDateDiff(eventTemplate) * 24 * 3600 * 1000,
    );

    // check if created event is before end of recurrence
    if (
      new Date(eventStartDate).getTime() < new Date(recurrenceEndDate).getTime()
    ) {
      generatedRecursiveEvents.push({
        ...eventTemplate,
        startDate: moment(eventStartDate).format('YYYY-MM-DD'),
        endDate: moment(eventEndDate).format('YYYY-MM-DD'),
      });
    }

    // create events until end of interval
    do {
      eventStartDate.setTime(
        eventStartDate.getTime() + 7 * 24 * 3600 * 1000 * recurrenceInterval,
      );
      // By default, the time is set to 00:00, but in the last weekend of every october the clocks are set back one hour (and that would put the events on the previous day, if we don't change the default hour)
      eventStartDate.setHours(1, 0, 0, 0);
      eventEndDate.setTime(
        eventStartDate.getTime() +
          startDateEndDateDiff(eventTemplate) * 24 * 3600 * 1000,
      );

      if (
        new Date(eventStartDate).getTime() <
        new Date(recurrenceEndDate).getTime()
      ) {
        generatedRecursiveEvents.push({
          ...eventTemplate,
          startDate: moment(eventStartDate).format('YYYY-MM-DD'),
          endDate: moment(eventEndDate).format('YYYY-MM-DD'),
        });
      }
    } while (
      new Date(interval.startDate).getTime() <
        new Date(eventStartDate).getTime() &&
      new Date(eventStartDate).getTime() < new Date(interval.endDate).getTime()
    );

    return generatedRecursiveEvents;
  },

  // TODO: humanize selectedMonth first
  monthly(eventTemplate, interval) {
    const eventStartDate = new Date(eventTemplate.startDate);
    const eventEndDate = new Date(eventTemplate.endDate);
    const recurrenceEndDate = new Date(eventTemplate.recurrenceEndDate);
    // TODO: explain what recurrenceInterval is
    const recurrenceInterval = eventTemplate.recurrenceInterval;

    const intervalStartDate = new Date(interval.startDate);
    const intervalMonthAndYear =
      // first day of interval is in current month
      intervalStartDate.getDate() === 1
        ? {
            month: intervalStartDate.getMonth(),
            year: intervalStartDate.getFullYear(),
          }
        : // first day of interval is before current month
        // previous month is December
        intervalStartDate.getMonth() === 11
        ? { month: 0, year: intervalStartDate.getFullYear() + 1 }
        : // first day of interval is before current month, but not December
          // year stays the same
          {
            month: intervalStartDate.getMonth() + 1,
            year: intervalStartDate.getFullYear(),
          };

    eventStartDate.setMonth(intervalMonthAndYear.month * recurrenceInterval);
    eventStartDate.setFullYear(intervalMonthAndYear.year);

    eventEndDate.setTime(
      eventStartDate.getTime() +
        startDateEndDateDiff(eventTemplate) * 24 * 3600 * 1000,
    );

    // create next event
    return new Date(eventStartDate).getTime() <
      new Date(recurrenceEndDate).getTime()
      ? [
          {
            ...eventTemplate,
            startDate: moment(eventStartDate).format('YYYY-MM-DD'),
            endDate: moment(eventEndDate).format('YYYY-MM-DD'),
          },
        ]
      : [];
  },

  annually(eventTemplate, interval) {
    const eventStartDate = new Date(eventTemplate.startDate);
    const eventEndDate = new Date(eventTemplate.endDate);
    const intervalStartDate = new Date(interval.startDate);
    const recurrenceEndDate = new Date(eventTemplate.recurrenceEndDate);
    const recurrenceInterval = eventTemplate.recurrenceInterval;

    // ?
    const intervalYear =
      intervalStartDate.getDate() === 1 ||
      new Date(eventStartDate).getMonth() === intervalStartDate.getMonth()
        ? intervalStartDate.getFullYear()
        : intervalStartDate.getMonth() === 11
        ? intervalStartDate.getFullYear() + 1
        : intervalStartDate.getFullYear();

    eventStartDate.setFullYear(intervalYear * recurrenceInterval);
    eventEndDate.setTime(
      eventStartDate.getTime() +
        startDateEndDateDiff(eventTemplate) * 24 * 3600 * 1000,
    );

    return new Date(eventStartDate).getTime() <
      new Date(recurrenceEndDate).getTime()
      ? [
          {
            ...eventTemplate,
            startDate: moment(eventStartDate).format('YYYY-MM-DD'),
            endDate: moment(eventEndDate).format('YYYY-MM-DD'),
          },
        ]
      : [];
  },

  daily(eventTemplate, interval) {
    const {
      eventStartDate,
      eventEndDate,
      recurrenceEndDate,
      recurrenceInterval,
    } = makeStartDate(eventTemplate, interval);

    const generatedRecursiveEvents = [];

    eventStartDate.setTime(eventStartDate.getTime());
    eventEndDate.setTime(
      eventStartDate.getTime() +
        startDateEndDateDiff(eventTemplate) * 24 * 3600 * 1000,
    );

    if (
      new Date(eventStartDate).getTime() < new Date(recurrenceEndDate).getTime()
    ) {
      generatedRecursiveEvents.push({
        ...eventTemplate,
        startDate: moment(eventStartDate).format('YYYY-MM-DD'),
        endDate: moment(eventEndDate).format('YYYY-MM-DD'),
      });
    }

    do {
      eventStartDate.setTime(
        eventStartDate.getTime() + 24 * 3600 * 1000 * recurrenceInterval,
      );
      // By default, the time is set to 00:00, but in the last weekend of every october the clocks are set back one hour (and that would put the events on the previous day, if we don't change the default hour)
      eventStartDate.setHours(1, 0, 0, 0);
      eventEndDate.setTime(
        eventStartDate.getTime() +
          startDateEndDateDiff(eventTemplate) * 24 * 3600 * 1000,
      );

      if (
        new Date(eventStartDate).getTime() <
        new Date(recurrenceEndDate).getTime()
      ) {
        generatedRecursiveEvents.push({
          ...eventTemplate,
          startDate: moment(eventStartDate).format('YYYY-MM-DD'),
          endDate: moment(eventEndDate).format('YYYY-MM-DD'),
        });
      }
    } while (
      new Date(interval.startDate).getTime() <
        new Date(eventStartDate).getTime() &&
      new Date(eventStartDate).getTime() < new Date(interval.endDate).getTime()
    );
    return generatedRecursiveEvents;
  },

  hourly(eventTemplate, interval) {
    const {
      eventStartDate,
      eventEndDate,
      recurrenceEndDate,
      recurrenceInterval,
    } = makeStartDate(eventTemplate, interval);

    const generatedRecursiveEvents = [];

    eventStartDate.setTime(eventStartDate.getTime());
    eventEndDate.setTime(
      eventStartDate.getTime() +
        startDateEndDateDiff(eventTemplate) * 3600 * 1000,
    );

    if (
      new Date(eventStartDate).getTime() < new Date(recurrenceEndDate).getTime()
    ) {
      generatedRecursiveEvents.push({
        ...eventTemplate,
        startDate: moment(eventStartDate).format('YYYY-MM-DD'),
        endDate: moment(eventEndDate).format('YYYY-MM-DD'),
      });
    }

    do {
      eventStartDate.setTime(
        eventStartDate.getTime() + 3600 * 1000 * recurrenceInterval,
      );
      eventEndDate.setTime(
        eventStartDate.getTime() +
          startDateEndDateDiff(eventTemplate) * 3600 * 1000,
      );

      if (
        new Date(eventStartDate).getTime() <
        new Date(recurrenceEndDate).getTime()
      ) {
        generatedRecursiveEvents.push({
          ...eventTemplate,
          startDate: moment(eventStartDate).format('YYYY-MM-DD'),
          endDate: moment(eventEndDate).format('YYYY-MM-DD'),
        });
      }
    } while (
      new Date(interval.startDate).getTime() <
        new Date(eventStartDate).getTime() &&
      new Date(eventStartDate).getTime() < new Date(interval.endDate).getTime()
    );

    return generatedRecursiveEvents;
  },

  minutely(eventTemplate, interval) {
    const {
      eventStartDate,
      eventEndDate,
      recurrenceEndDate,
      recurrenceInterval,
    } = makeStartDate(eventTemplate, interval);

    const generatedRecursiveEvents = [];

    eventStartDate.setTime(eventStartDate.getTime());
    eventEndDate.setTime(
      eventStartDate.getTime() +
        startDateEndDateDiff(eventTemplate) * 60 * 1000,
    );

    if (
      new Date(eventStartDate).getTime() < new Date(recurrenceEndDate).getTime()
    ) {
      generatedRecursiveEvents.push({
        ...eventTemplate,
        startDate: moment(eventStartDate).format('YYYY-MM-DD'),
        endDate: moment(eventEndDate).format('YYYY-MM-DD'),
      });
    }

    do {
      eventStartDate.setTime(
        eventStartDate.getTime() + 60 * 1000 * recurrenceInterval,
      );
      eventEndDate.setTime(
        eventStartDate.getTime() +
          startDateEndDateDiff(eventTemplate) * 60 * 1000,
      );

      if (
        new Date(eventStartDate).getTime() <
        new Date(recurrenceEndDate).getTime()
      ) {
        generatedRecursiveEvents.push({
          ...eventTemplate,
          startDate: moment(eventStartDate).format('YYYY-MM-DD'),
          endDate: moment(eventEndDate).format('YYYY-MM-DD'),
        });
      }
    } while (
      new Date(interval.startDate).getTime() <
        new Date(eventStartDate).getTime() &&
      new Date(eventStartDate).getTime() < new Date(interval.endDate).getTime()
    );

    return generatedRecursiveEvents;
  },

  secondly(eventTemplate, interval) {
    const {
      eventStartDate,
      eventEndDate,
      recurrenceEndDate,
      recurrenceInterval,
    } = makeStartDate(eventTemplate, interval);

    const generatedRecursiveEvents = [];

    eventStartDate.setTime(eventStartDate.getTime());
    eventEndDate.setTime(
      eventStartDate.getTime() + startDateEndDateDiff(eventTemplate) * 1000,
    );

    if (
      new Date(eventStartDate).getTime() < new Date(recurrenceEndDate).getTime()
    ) {
      generatedRecursiveEvents.push({
        ...eventTemplate,
        startDate: moment(eventStartDate).format('YYYY-MM-DD'),
        endDate: moment(eventEndDate).format('YYYY-MM-DD'),
      });
    }

    do {
      eventStartDate.setTime(
        eventStartDate.getTime() + 1000 * recurrenceInterval,
      );
      eventEndDate.setTime(
        eventStartDate.getTime() + startDateEndDateDiff(eventTemplate) * 1000,
      );

      if (
        new Date(eventStartDate).getTime() <
        new Date(recurrenceEndDate).getTime()
      ) {
        generatedRecursiveEvents.push({
          ...eventTemplate,
          startDate: moment(eventStartDate).format('YYYY-MM-DD'),
          endDate: moment(eventEndDate).format('YYYY-MM-DD'),
        });
      }
    } while (
      new Date(interval.startDate).getTime() <
        new Date(eventStartDate).getTime() &&
      new Date(eventStartDate).getTime() < new Date(interval.endDate).getTime()
    );

    return generatedRecursiveEvents;
  },
};
