import React, { useState, useEffect } from 'react';
import './coursesCalendar.css';
import * as views from './views';
import { INITIAL_VIEW } from './constants';
// import { firstAndLastDayOfTheWeek } from './views/week/firstAndLastDayOfTheWeek';
// import { makeIntervalToFetchMonthEvents } from './views/month/makeIntervalToFetchMonthEvents';
// import { makeInterval } from './views/week/makeInterval';
import { recursiveEventsInInterval } from './views/month/recursiveEventsInInterval';
import { recursiveFunctions } from './views/month/recursiveFunctions';

const viewNames = Object.keys(views);

const Calendar = ({
  normalEvents = [],
  recursiveEvents = [],
  // ModalPopUp,
  // handleOpenModal,
  fetchEventsByInterval,
  getCurrentEventById,
  makeDefaultEvent,
  editEventData,
  isEditMode,
  newInterval: selectedInterval,
}) => {
  const [selectedView, setSelectedView] = useState(INITIAL_VIEW);

  const View = views[selectedView];

  const [allEvents, setAllEvents] = useState([]);

  useEffect(() => {
    // const selectedInterval =
    //   selectedView === 'Month'
    //     ? makeIntervalToFetchMonthEvents(selectedMonth, selectedYear, allEvents)
    //     : makeInterval(
    //         new Date(firstDayOfCurrentWeek).getFullYear(),
    //         new Date(firstDayOfCurrentWeek).getMonth(),
    //         new Date(firstDayOfCurrentWeek).getDate(),
    //         new Date(lastDayOfCurrentWeek).getFullYear(),
    //         new Date(lastDayOfCurrentWeek).getMonth(),
    //         new Date(lastDayOfCurrentWeek).getDate(),
    //       );

    const relevantRecursiveEvents = recursiveEvents.filter((event) =>
      recursiveEventsInInterval(event, selectedInterval),
    );

    const allRecursiveEvents = relevantRecursiveEvents.reduce(
      (acc, currentEvent) => {
        return [
          ...acc,
          ...recursiveFunctions[currentEvent.recursive](
            currentEvent,
            selectedInterval,
          ),
        ];
      },
      [],
    );

    setAllEvents([...normalEvents, ...allRecursiveEvents]);
  }, [normalEvents, recursiveEvents, selectedInterval, selectedView]);

  const handleEdit = (eventId) => {
    getCurrentEventById(eventId);
    // handleOpenModal();
  };

  return (
    <div>
      <View
        {...{
          selectedView,
          viewNames,
          setSelectedView,
          // ModalPopUp,
          handleEdit,
          allEvents,
          fetchEventsByInterval,
          editEventData,
          // handleOpenModal,
          makeDefaultEvent,
          isEditMode,
        }}
      />
    </div>
  );
};

export default Calendar;
