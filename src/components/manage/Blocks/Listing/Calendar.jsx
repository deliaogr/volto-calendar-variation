import React, { useState, useEffect, useRef } from 'react';
import '../Calendar/coursesCalendar.css';
import * as views from '../Calendar/views';
import moment from 'moment';
import { INITIAL_VIEW } from '../Calendar/constants';
import { flattenToAppURL } from '@plone/volto/helpers';

const viewNames = Object.keys(views);

const CalendarListing = ({
  //   normalEvents = [],
  //   recursiveEvents = [],
  //   ModalPopUp,
  //   handleOpenModal,
  //   fetchEventsByInterval,
  //   getCurrentEventById,
  //   makeDefaultEvent,
  //   editEventData,
  items,
  isEditMode,
}) => {
  const [selectedView, setSelectedView] = useState(INITIAL_VIEW);
  const [normalEvents, setNormalEvents] = useState([]);
  const [recursiveEvents, setRecursiveEvents] = useState([]);
  const [newInterval, setNewInterval] = useState();
  const allEventsRef = useRef();

  let defaultEvent = {};
  const View = views[selectedView];

  useEffect(() => makeEventsByInterval(newInterval), [newInterval]);

  useEffect(() => {
    allEventsRef.current = items
      .filter((i) => i['@type'] === 'Event')
      .map((i) => {
        let freqValue = null;
        if (i.recurrence) {
          const freqIndex = i.recurrence.indexOf('FREQ=');
          const semicolonIndex = i.recurrence.indexOf(';', freqIndex);
          freqValue = i.recurrence.substring(freqIndex + 5, semicolonIndex);
        }

        const startDateTime = new Date(i.start);
        const endDateTime = new Date(i.end);

        const startHour = startDateTime.getHours().toString().padStart(2, '0');
        const startMinutes = startDateTime
          .getMinutes()
          .toString()
          .padStart(2, '0');
        const endHour = endDateTime.getHours().toString().padStart(2, '0');
        const endMinutes = endDateTime.getMinutes().toString().padStart(2, '0');

        const isFullDayEvent =
          startHour === '01' &&
          startMinutes === '00' &&
          endHour === '00' &&
          endMinutes === '59';

        return {
          title: i.title,
          startDate: moment(startDateTime).format('YYYY-MM-DD'),
          endDate: moment(endDateTime).format('YYYY-MM-DD'),
          startHour: isFullDayEvent ? null : `${startHour}:${startMinutes}`,
          endHour: isFullDayEvent ? null : `${endHour}:${endMinutes}`,
          url: flattenToAppURL(i['@id']),
          id: Math.floor(Math.random() * 100),
          recursive: freqValue ? freqValue.toLowerCase() : 'no',
        };
      });
  }, [items]);

  // console.log({ normalEvents, recursiveEvents });

  const makeEventsByInterval = (interval) => {
    setNormalEvents(
      allEventsRef.current?.filter(
        (i) =>
          i.recursive === 'no' &&
          moment(i.startDate).isBetween(
            interval.startDate,
            interval.endDate,
            undefined,
            '[]',
          ),
      ) || [],
    );
    setRecursiveEvents(
      allEventsRef.current?.filter((i) => i.recursive !== 'no') || [],
    );
  };

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

  const handleEdit = (eventId) => {
    getCurrentEventById(eventId);
    // handleOpenModal();
  };

  const makeDefaultEvent = (interval) =>
    (defaultEvent = {
      ...interval,
      recursive: 'no',
    });

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

export default CalendarListing;
