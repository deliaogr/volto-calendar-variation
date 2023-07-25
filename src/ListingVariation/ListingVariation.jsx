import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import Calendar from '../Calendar/Calendar';
import { formatEvents } from '../Utils/RRuleConnector';
import { makeRecursiveEvents } from '../Utils/Recursivator/makeRecursiveEvents';
/* 
  TODO: refactor:
  1. recursivator
  2. refactor views
  3. connector
**/

// should not end before interval or start after interval
const isPossiblyRelevant = (event, interval) => {
  return !(
    new Date(event.recurrenceEndDate) < new Date(interval.startDate) ||
    new Date(interval.endDate) < new Date(event.startDate)
  );
};

const ListingVariation = ({ items, isEditMode }) => {
  const allEventsRef = useRef([]);

  const [allEventsInInterval, setAllEventsInInterval] = useState([]);
  const [newInterval, setNewInterval] = useState();

  let defaultEvent = {};

  useEffect(() => {
    let events = items.filter((item) => item['@type'] === 'Event');
    allEventsRef.current = formatEvents(events);
  }, [items]);

  useEffect(() => {
    const makeEventsByInterval = (interval) => {
      if (!interval) return;
      const normalEvents =
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
        }) || [];

      // events received from BE will have information on recursion,
      // we consider them templates, we select those in interval
      // based on them we will generate new events
      const recursiveEventTemplates =
        allEventsRef.current.filter(
          (event) =>
            event.recursive !== 'no' && isPossiblyRelevant(event, interval),
        ) || [];

      const recursiveEvents = makeRecursiveEvents(
        recursiveEventTemplates,
        interval,
      );

      setAllEventsInInterval([...normalEvents, ...recursiveEvents]);
    };

    makeEventsByInterval(newInterval);
  }, [newInterval]);

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

export default ListingVariation;
