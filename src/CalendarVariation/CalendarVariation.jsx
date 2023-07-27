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
  const [eventsInInterval, setEventsInInterval] = useState([]);
  const [interval, setInterval] = useState();

  let defaultEvent = {};

  // TODO: bug: items doesn't get updated when creating a new event
  useEffect(() => {
    let events = items.filter((item) => item['@type'] === 'Event');
    if (!interval) return;
    setEventsInInterval(formatEventsForInterval(events, interval));
  }, [items, interval]);

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
    return eventsInInterval[eventId];
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
          setInterval,
          getCurrentEventById,
          makeDefaultEvent,
          updateEvent,
          isEditMode,
          eventsInInterval,
        }}
      />
    </div>
  );
};

export default CalendarVariation;
