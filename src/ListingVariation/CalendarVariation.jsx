import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import Calendar from '../Calendar/Calendar';
import { formatEvents } from '../Connector';

const ListingVariation = ({ items, isEditMode }) => {
  const [normalEvents, setNormalEvents] = useState([]);
  const [recursiveEvents, setRecursiveEvents] = useState([]);
  const [newInterval, setNewInterval] = useState();
  const allEventsRef = useRef([]);

  let defaultEvent = {};

  useEffect(() => {
    let filteredEvents = items.filter((item) => item['@type'] === 'Event');
    allEventsRef.current = formatEvents(filteredEvents);
  }, [items]);

  useEffect(() => {
    const makeEventsByInterval = (interval) => {
      if (!interval) return;
      setNormalEvents(
        allEventsRef.current.filter((event) => {
          return (
            event.recursive === 'no' &&
            moment(event.startDate).isBetween(
              interval.startDate,
              interval.endDate,
              undefined,
              '[]',
            )
          );
        }) || [],
      );
      setRecursiveEvents(
        allEventsRef.current.filter((event) => event.recursive !== 'no') || [],
      );
    };

    makeEventsByInterval(newInterval);
  }, [newInterval, allEventsRef]);

  const fetchEventsByInterval = (interval) => {
    setNewInterval(interval);
  };

  const editEventData = (eventData) => {
    // editEvent({
    //   title: eventData.title,
    //   startDate: eventData.startDate,
    //   endDate: eventData.endDate,
    //   id: eventData.id,
    //   startHour: eventData.startHour ? eventData.startHour : null,
    //   endHour: eventData.endHour ? eventData.endHour : null,
    //   recursive: eventData.recursive,
    // });
    console.log('event moved');
  };

  const getCurrentEventById = (eventId) => {
    return allEventsRef.current[eventId];
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
          normalEvents,
          recursiveEvents,
          // ModalPopUp,
          // handleOpenModal,
          fetchEventsByInterval,
          getCurrentEventById,
          makeDefaultEvent,
          editEventData,
          isEditMode,
          newInterval,
        }}
      />
    </div>
  );
};

export default ListingVariation;
