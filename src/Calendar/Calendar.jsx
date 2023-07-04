import React, { useState } from 'react';
import './coursesCalendar.css';
import * as views from './views';
import { INITIAL_VIEW } from './constants';

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
  items,
  isEditMode,
}) => {
  const [selectedView, setSelectedView] = useState(INITIAL_VIEW);
  // const [normalEvents, setNormalEvents] = useState([]);
  // const [recursiveEvents, setRecursiveEvents] = useState([]);
  // const [newInterval, setNewInterval] = useState();
  // const allEventsRef = useRef([]);

  const View = views[selectedView];

  // useEffect(() => {
  //   allEventsRef.current = items
  //     .filter((item) => item['@type'] === 'Event')
  //     .map((event) => {
  //       let freqValue = null;
  //       let recurrenceEndDate = null;
  //       let recurrenceInterval = null;
  //       if (event.recurrence) {
  //         const freqIndex = event.recurrence.indexOf('FREQ=');
  //         const semicolonIndex = event.recurrence.indexOf(';', freqIndex);
  //         freqValue = event.recurrence.substring(freqIndex + 5, semicolonIndex);

  //         const rrule = rrulestr(event.recurrence);

  //         recurrenceInterval = rrule.options.interval || null;
  //         const recurrenceCount = rrule.options.count || null;

  //         const timeIncrementValue =
  //           freqValue === 'monthly' ? 'M' : freqValue.slice(0, 1).toLowerCase();
  //         const calculatedEndDate =
  //           recurrenceCount &&
  //           moment(new Date(event.end)).add(
  //             recurrenceInterval * recurrenceCount - 1,
  //             timeIncrementValue,
  //           );

  //         recurrenceEndDate =
  //           rrule.options.until || calculatedEndDate.toDate() || null;
  //       }

  //       const startDateTime = new Date(event.start);
  //       const endDateTime = new Date(event.end);

  //       const startHour = startDateTime.getHours().toString().padStart(2, '0');
  //       const startMinutes = startDateTime
  //         .getMinutes()
  //         .toString()
  //         .padStart(2, '0');
  //       const endHour = endDateTime.getHours().toString().padStart(2, '0');
  //       const endMinutes = endDateTime.getMinutes().toString().padStart(2, '0');

  //       const isFullDayEvent = event.whole_day ? true : false;

  //       return {
  //         title: event.title,
  //         startDate: moment(startDateTime).format('YYYY-MM-DD'),
  //         endDate: moment(endDateTime).format('YYYY-MM-DD'),
  //         startHour: isFullDayEvent ? null : `${startHour}:${startMinutes}`,
  //         endHour: isFullDayEvent ? null : `${endHour}:${endMinutes}`,
  //         url: flattenToAppURL(event['@id']),
  //         id: Math.floor(Math.random() * 100),
  //         recursive: freqValue ? freqValue.toLowerCase() : 'no',
  //         recurrenceEndDate:
  //           moment(recurrenceEndDate).format('YYYY-MM-DD') || null,
  //         recurrenceInterval: recurrenceInterval || 1,
  //       };
  //     });
  // }, [items]);

  // useEffect(() => {
  //   const makeEventsByInterval = (interval) => {
  //     if (!interval) return;
  //     setNormalEvents(
  //       allEventsRef.current.filter((event) => {
  //         return (
  //           event.recursive === 'no' &&
  //           moment(event.startDate).isBetween(
  //             interval.startDate,
  //             interval.endDate,
  //             undefined,
  //             '[]',
  //           )
  //         );
  //       }) || [],
  //     );
  //     setRecursiveEvents(
  //       allEventsRef.current.filter((event) => event.recursive !== 'no') || [],
  //     );
  //   };

  //   makeEventsByInterval(newInterval);
  // }, [newInterval, allEventsRef]);

  // const fetchEventsByInterval = (interval) => {
  //   setNewInterval(interval);
  // };

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
          normalEvents,
          recursiveEvents,
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
