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
      return {
        title: i.title,
        start: i.start,
        end: i.end,
        url: flattenToAppURL(i['@id']),
      };
    });

  console.log(normalEvents);

  const fetchEventsByInterval = (interval) => {
    return normalEvents.filter(
      (event) =>
        moment(event.start).format('YYYY-MM-DD') ===
          moment(interval.start).format('YYYY-MM-DD') &&
        moment(event.end).format('YYYY-MM-DD') ===
          moment(interval.end).format('YYYY-MM-DD'),
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
