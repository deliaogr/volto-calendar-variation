import React, { useState, useEffect } from 'react';
import Calendar from '../Calendar/Calendar';
import { formatEventsForInterval } from '../Utils/RRuleConnector';

/* 
  TODO: refactor:
  1. recursivator
  2. refactor views
  3. connector
**/

const CalendarVariation = ({ items, isEditMode }) => {
  const [allEventsInInterval, setAllEventsInInterval] = useState([]);
  const [newInterval, setNewInterval] = useState();

  let defaultEvent = {};

  useEffect(() => {
    let events = items.filter((item) => item['@type'] === 'Event');
    if (!newInterval) return;
    setAllEventsInInterval(formatEventsForInterval(events, newInterval));
  }, [items, newInterval]);

  const setIntervalForNewEvents = (interval) => {
    setNewInterval(interval);
  };

  const updateEvent = (eventData) => {
    // editEvent({
    //   title: eventData.title,
    //   startDate: eventData.startDate,
    //   endDate: eventData.endDate,
    //   id: eventData.id,
    //   startHour: eventData.startHour ? eventData.startHour : null,
    //   endHour: eventData.endHour ? eventData.endHour : null,
    //   recursive: eventData.recursive,
    // });
  };

  const getCurrentEventById = (eventId) => {
    return allEventsInInterval[eventId];
  };

  const makeDefaultEvent = (interval) =>
    (defaultEvent = {
      ...interval,
      recursive: 'no',
    });

  return (
    <div>
      <Calendar
        {...{
          // ModalPopUp,
          // handleOpenModal,
          setIntervalForNewEvents,
          getCurrentEventById,
          makeDefaultEvent,
          updateEvent,
          isEditMode,
          allEventsInInterval,
        }}
      />
    </div>
  );
};

export default CalendarVariation;
