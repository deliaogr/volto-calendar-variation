import React, { useState } from 'react';
import './coursesCalendar.css';
import * as views from './views';
import moment from 'moment';
import { INITIAL_VIEW } from './constants';
import { flattenToAppURL } from '@plone/volto/helpers';

const viewNames = Object.keys(views);

const CalendarListing = ({
  //   normalEvents = [],
  recursiveEvents = [],
  //   ModalPopUp,
  //   handleOpenModal,
  //   fetchEventsByInterval,
  //   getCurrentEventById,
  //   makeDefaultEvent,
  //   editEventData,
  items,
}) => {
  const [selectedView, setSelectedView] = useState(INITIAL_VIEW);
  let defaultEvent = {};
  const View = views[selectedView];

  const handleEdit = (eventId) => {
    getCurrentEventById(eventId);
    // handleOpenModal();
  };

  const normalEvents = items
    .filter((i) => {
      if (i['@type'] !== 'Event') return false;
      if (i.recurrence) {
        console.log('recurrent', i);
        /* expand returns initial event as well, so we skip it here */
        return false;
      }
      return true;
    })
    .map((i) => {
      const startDateTime = new Date(i.start);
      const endDateTime = new Date(i.end);

      const startHour = startDateTime.getHours().toString().padStart(2, '0');
      const startMinutes = startDateTime
        .getMinutes()
        .toString()
        .padStart(2, '0');
      const endHour = endDateTime.getHours().toString().padStart(2, '0');
      const endMinutes = endDateTime.getMinutes().toString().padStart(2, '0');

      return {
        title: i.title,
        startDate: moment(startDateTime).format('YYYY-MM-DD'),
        endDate: moment(endDateTime).format('YYYY-MM-DD'),
        startHour: `${startHour}:${startMinutes}`,
        endHour: `${endHour}:${endMinutes}`,
        url: flattenToAppURL(i['@id']),
        id: Math.floor(Math.random() * 100),
      };
    });

  const fetchEventsByInterval = (interval) => {
    return normalEvents.filter(
      (event) =>
        moment(event.startDate).format('YYYY-MM-DD') ===
          moment(interval.startDate).format('YYYY-MM-DD') &&
        moment(event.endDate).format('YYYY-MM-DD') ===
          moment(interval.endDate).format('YYYY-MM-DD'),
    );
  };

  const getCurrentEventById = (eventId) => {
    return normalEvents[eventId];
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
          // handleEdit,
          normalEvents,
          recursiveEvents,
          // fetchEventsByInterval,
          // editEventData,
          // handleOpenModal,
          makeDefaultEvent,
        }}
      />
    </div>
  );
};

export default CalendarListing;
