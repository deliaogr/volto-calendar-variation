import moment from 'moment';

const startDateEventStartDateIntervalDiff = (interval, event) => {
  const intervalStartTime = new Date(interval.startDate).getTime();
  const eventStartTime = new Date(event.startDate).getTime();
  const result = (intervalStartTime - eventStartTime) / (1000 * 3600 * 24);
  // return result > -7 ? result : -7;
  return result;
};

const currentEventWeekIndex = (event) => {
  const result =
    new Date(event.startDate).getDay() === 0
      ? 6
      : new Date(event.startDate).getDay() - 1;
  return result;
};

const makeStartDate = (currentEvent, selectedInterval) => {
  const eventStartDate = new Date(currentEvent.startDate);
  const eventEndDate = new Date(currentEvent.endDate);
  const recurrenceEndDate = new Date(currentEvent.recurrenceEndDate) || null;
  const recurrenceInterval = currentEvent.recurrenceInterval;

  eventStartDate.setTime(
    eventStartDate.getTime() +
      (startDateEventStartDateIntervalDiff(selectedInterval, currentEvent) > 0
        ? startDateEventStartDateIntervalDiff(selectedInterval, currentEvent) +
          currentEventWeekIndex(currentEvent)
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

const startDateEndDateDiff = (event) => {
  const result =
    (new Date(event.endDate).getTime() - new Date(event.startDate).getTime()) /
    (1000 * 3600 * 24);
  return result;
};

export const recursiveFunctions = {
  weekly(currentEvent, selectedInterval) {
    const {
      eventStartDate,
      eventEndDate,
      recurrenceEndDate,
      recurrenceInterval,
    } = makeStartDate(currentEvent, selectedInterval);

    const generatedRecursiveEvents = [];

    eventStartDate.setTime(eventStartDate.getTime());
    eventEndDate.setTime(
      eventStartDate.getTime() +
        startDateEndDateDiff(currentEvent) * 24 * 3600 * 1000,
    );

    if (
      new Date(eventStartDate).getTime() < new Date(recurrenceEndDate).getTime()
    ) {
      generatedRecursiveEvents.push({
        ...currentEvent,
        startDate: moment(eventStartDate).format('YYYY-MM-DD'),
        endDate: moment(eventEndDate).format('YYYY-MM-DD'),
      });
    }

    do {
      eventStartDate.setTime(
        eventStartDate.getTime() + 7 * 24 * 3600 * 1000 * recurrenceInterval,
      );
      // By default, the time is set to 00:00, but in the last weekend of every october the clocks are set back one hour (and that would put the events on the previous day, if we don't change the default hour)
      eventStartDate.setHours(1, 0, 0, 0);
      eventEndDate.setTime(
        eventStartDate.getTime() +
          startDateEndDateDiff(currentEvent) * 24 * 3600 * 1000,
      );

      if (
        new Date(eventStartDate).getTime() <
        new Date(recurrenceEndDate).getTime()
      ) {
        generatedRecursiveEvents.push({
          ...currentEvent,
          startDate: moment(eventStartDate).format('YYYY-MM-DD'),
          endDate: moment(eventEndDate).format('YYYY-MM-DD'),
        });
      }
    } while (
      new Date(selectedInterval.startDate).getTime() <
        new Date(eventStartDate).getTime() &&
      new Date(eventStartDate).getTime() <
        new Date(selectedInterval.endDate).getTime()
    );

    return generatedRecursiveEvents;
  },

  monthly(currentEvent, selectedInterval) {
    const eventStartDate = new Date(currentEvent.startDate);
    const eventEndDate = new Date(currentEvent.endDate);
    const recurrenceEndDate = new Date(currentEvent.recurrenceEndDate);
    const recurrenceInterval = currentEvent.recurrenceInterval;

    const intervalStartDate = new Date(selectedInterval.startDate);
    const intervalMonthAndYear =
      intervalStartDate.getDate() === 1
        ? {
            month: intervalStartDate.getMonth(),
            year: intervalStartDate.getFullYear(),
          }
        : intervalStartDate.getMonth() === 11
        ? { month: 0, year: intervalStartDate.getFullYear() + 1 }
        : {
            month: intervalStartDate.getMonth() + 1,
            year: intervalStartDate.getFullYear(),
          };

    eventStartDate.setMonth(intervalMonthAndYear.month * recurrenceInterval);
    eventStartDate.setFullYear(intervalMonthAndYear.year);

    eventEndDate.setTime(
      eventStartDate.getTime() +
        startDateEndDateDiff(currentEvent) * 24 * 3600 * 1000,
    );
    return new Date(eventStartDate).getTime() <
      new Date(recurrenceEndDate).getTime()
      ? [
          {
            ...currentEvent,
            startDate: moment(eventStartDate).format('YYYY-MM-DD'),
            endDate: moment(eventEndDate).format('YYYY-MM-DD'),
          },
        ]
      : [];
  },

  annually(currentEvent, selectedInterval) {
    const eventStartDate = new Date(currentEvent.startDate);
    const eventEndDate = new Date(currentEvent.endDate);
    const intervalStartDate = new Date(selectedInterval.startDate);
    const recurrenceEndDate = new Date(currentEvent.recurrenceEndDate);
    const recurrenceInterval = currentEvent.recurrenceInterval;

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
        startDateEndDateDiff(currentEvent) * 24 * 3600 * 1000,
    );

    return new Date(eventStartDate).getTime() <
      new Date(recurrenceEndDate).getTime()
      ? [
          {
            ...currentEvent,
            startDate: moment(eventStartDate).format('YYYY-MM-DD'),
            endDate: moment(eventEndDate).format('YYYY-MM-DD'),
          },
        ]
      : [];
  },

  daily(currentEvent, selectedInterval) {
    const {
      eventStartDate,
      eventEndDate,
      recurrenceEndDate,
      recurrenceInterval,
    } = makeStartDate(currentEvent, selectedInterval);

    const generatedRecursiveEvents = [];

    eventStartDate.setTime(eventStartDate.getTime());
    eventEndDate.setTime(
      eventStartDate.getTime() +
        startDateEndDateDiff(currentEvent) * 24 * 3600 * 1000,
    );
    if (
      new Date(eventStartDate).getTime() < new Date(recurrenceEndDate).getTime()
    ) {
      generatedRecursiveEvents.push({
        ...currentEvent,
        startDate: moment(eventStartDate).format('YYYY-MM-DD HH:mm:ss'),
        endDate: moment(eventEndDate).format('YYYY-MM-DD HH:mm:ss'),
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
          startDateEndDateDiff(currentEvent) * 24 * 3600 * 1000,
      );

      if (
        new Date(eventStartDate).getTime() <
        new Date(recurrenceEndDate).getTime()
      ) {
        generatedRecursiveEvents.push({
          ...currentEvent,
          startDate: moment(eventStartDate).format('YYYY-MM-DD HH:mm:ss'),
          endDate: moment(eventEndDate).format('YYYY-MM-DD HH:mm:ss'),
        });
      }
    } while (
      new Date(selectedInterval.startDate).getTime() <
        new Date(eventStartDate).getTime() &&
      new Date(eventStartDate).getTime() <
        new Date(selectedInterval.endDate).getTime()
    );
    return generatedRecursiveEvents;
  },

  hourly(currentEvent, selectedInterval) {
    const {
      eventStartDate,
      eventEndDate,
      recurrenceEndDate,
      recurrenceInterval,
    } = makeStartDate(currentEvent, selectedInterval);

    const generatedRecursiveEvents = [];

    eventStartDate.setTime(eventStartDate.getTime());
    eventEndDate.setTime(
      eventStartDate.getTime() +
        startDateEndDateDiff(currentEvent) * 3600 * 1000,
    );

    if (
      new Date(eventStartDate).getTime() < new Date(recurrenceEndDate).getTime()
    ) {
      generatedRecursiveEvents.push({
        ...currentEvent,
        startDate: moment(eventStartDate).format('YYYY-MM-DD HH:mm:ss'),
        endDate: moment(eventEndDate).format('YYYY-MM-DD HH:mm:ss'),
      });
    }

    do {
      eventStartDate.setTime(
        eventStartDate.getTime() + 3600 * 1000 * recurrenceInterval,
      );
      eventEndDate.setTime(
        eventStartDate.getTime() +
          startDateEndDateDiff(currentEvent) * 3600 * 1000,
      );

      if (
        new Date(eventStartDate).getTime() <
        new Date(recurrenceEndDate).getTime()
      ) {
        generatedRecursiveEvents.push({
          ...currentEvent,
          startDate: moment(eventStartDate).format('YYYY-MM-DD HH:mm:ss'),
          endDate: moment(eventEndDate).format('YYYY-MM-DD HH:mm:ss'),
        });
      }
    } while (
      new Date(selectedInterval.startDate).getTime() <
        new Date(eventStartDate).getTime() &&
      new Date(eventStartDate).getTime() <
        new Date(selectedInterval.endDate).getTime()
    );

    return generatedRecursiveEvents;
  },

  minutely(currentEvent, selectedInterval) {
    const {
      eventStartDate,
      eventEndDate,
      recurrenceEndDate,
      recurrenceInterval,
    } = makeStartDate(currentEvent, selectedInterval);

    const generatedRecursiveEvents = [];

    eventStartDate.setTime(eventStartDate.getTime());
    eventEndDate.setTime(
      eventStartDate.getTime() + startDateEndDateDiff(currentEvent) * 60 * 1000,
    );

    if (
      new Date(eventStartDate).getTime() < new Date(recurrenceEndDate).getTime()
    ) {
      generatedRecursiveEvents.push({
        ...currentEvent,
        startDate: moment(eventStartDate).format('YYYY-MM-DD HH:mm:ss'),
        endDate: moment(eventEndDate).format('YYYY-MM-DD HH:mm:ss'),
      });
    }

    do {
      eventStartDate.setTime(
        eventStartDate.getTime() + 60 * 1000 * recurrenceInterval,
      );
      eventEndDate.setTime(
        eventStartDate.getTime() +
          startDateEndDateDiff(currentEvent) * 60 * 1000,
      );

      if (
        new Date(eventStartDate).getTime() <
        new Date(recurrenceEndDate).getTime()
      ) {
        generatedRecursiveEvents.push({
          ...currentEvent,
          startDate: moment(eventStartDate).format('YYYY-MM-DD HH:mm:ss'),
          endDate: moment(eventEndDate).format('YYYY-MM-DD HH:mm:ss'),
        });
      }
    } while (
      new Date(selectedInterval.startDate).getTime() <
        new Date(eventStartDate).getTime() &&
      new Date(eventStartDate).getTime() <
        new Date(selectedInterval.endDate).getTime()
    );

    return generatedRecursiveEvents;
  },

  secondly(currentEvent, selectedInterval) {
    const {
      eventStartDate,
      eventEndDate,
      recurrenceEndDate,
      recurrenceInterval,
    } = makeStartDate(currentEvent, selectedInterval);

    const generatedRecursiveEvents = [];

    eventStartDate.setTime(eventStartDate.getTime());
    eventEndDate.setTime(
      eventStartDate.getTime() + startDateEndDateDiff(currentEvent) * 1000,
    );

    if (
      new Date(eventStartDate).getTime() < new Date(recurrenceEndDate).getTime()
    ) {
      generatedRecursiveEvents.push({
        ...currentEvent,
        startDate: moment(eventStartDate).format('YYYY-MM-DD HH:mm:ss'),
        endDate: moment(eventEndDate).format('YYYY-MM-DD HH:mm:ss'),
      });
    }

    do {
      eventStartDate.setTime(
        eventStartDate.getTime() + 1000 * recurrenceInterval,
      );
      eventEndDate.setTime(
        eventStartDate.getTime() + startDateEndDateDiff(currentEvent) * 1000,
      );

      if (
        new Date(eventStartDate).getTime() <
        new Date(recurrenceEndDate).getTime()
      ) {
        generatedRecursiveEvents.push({
          ...currentEvent,
          startDate: moment(eventStartDate).format('YYYY-MM-DD HH:mm:ss'),
          endDate: moment(eventEndDate).format('YYYY-MM-DD HH:mm:ss'),
        });
      }
    } while (
      new Date(selectedInterval.startDate).getTime() <
        new Date(eventStartDate).getTime() &&
      new Date(eventStartDate).getTime() <
        new Date(selectedInterval.endDate).getTime()
    );

    return generatedRecursiveEvents;
  },
};
