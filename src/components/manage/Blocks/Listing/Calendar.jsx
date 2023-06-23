import React, { useState } from 'react';
import '../Calendar/coursesCalendar.css';
import * as views from '../Calendar/views';
import moment from 'moment';
import { INITIAL_VIEW } from '../Calendar/constants';
import { flattenToAppURL } from '@plone/volto/helpers';
import { RRule, rrulestr } from 'rrule';

const viewNames = Object.keys(views);

const expand = (item) => {
  let recurrence = item.recurrence;
  if (item.recurrence.indexOf('DTSTART') < 0) {
    var dtstart = RRule.optionsToString({
      dtstart: new Date(item.start),
    });
    recurrence = dtstart + '\n' + recurrence;
  }

  const rrule = rrulestr(recurrence, { unfold: true, forceset: true });

  const startDateTime = new Date(rrule.options.dtstart);

  const startHour = startDateTime.getHours().toString().padStart(2, '0');
  const startMinutes = startDateTime.getMinutes().toString().padStart(2, '0');

  const isFullDayEvent =
    startHour === '01' && startMinutes === '00' ? true : false;

  const freqIndex = recurrence.indexOf('FREQ=');
  const semicolonIndex = recurrence.indexOf(';', freqIndex);
  const freqValue = recurrence.substring(freqIndex + 5, semicolonIndex);

  return {
    title: item.title,
    startDate: moment(rrule.options.dtstart).format('YYYY-MM-DD'),
    endDate: null,
    url: flattenToAppURL(item['@id']),
    // endDate: moment(endDateTime).format('YYYY-MM-DD'),
    startHour: isFullDayEvent ? null : `${startHour}:${startMinutes}`,
    // endHour: isFullDayEvent ? null : `${endHour}:${endMinutes}`,
    endHour: null,
    id: Math.floor(Math.random() * 100),
    recursive: freqValue.toLowerCase(),
  };
};

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
  let defaultEvent = {};
  let recursiveEvents = [];
  const View = views[selectedView];

  const normalEvents = items
    .filter((i) => {
      if (i['@type'] !== 'Event') return false;
      if (i.recurrence) {
        recursiveEvents = recursiveEvents.concat(expand(i));
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

      const isFullDayEvent =
        startHour === '01' &&
        startMinutes === '00' &&
        endHour === '00' &&
        endMinutes === '59'
          ? true
          : false;

      return {
        title: i.title,
        startDate: moment(startDateTime).format('YYYY-MM-DD'),
        endDate: moment(endDateTime).format('YYYY-MM-DD'),
        startHour: isFullDayEvent ? null : `${startHour}:${startMinutes}`,
        endHour: isFullDayEvent ? null : `${endHour}:${endMinutes}`,
        url: flattenToAppURL(i['@id']),
        id: Math.floor(Math.random() * 100),
        recursive: 'no',
      };
    });
  console.log({ normalEvents, recursiveEvents });

  const fetchEventsByInterval = (interval) => {
    return normalEvents.filter(
      (event) =>
        moment(event.startDate).format('YYYY-MM-DD') ===
          moment(interval.startDate).format('YYYY-MM-DD') &&
        moment(event.endDate).format('YYYY-MM-DD') ===
          moment(interval.endDate).format('YYYY-MM-DD'),
    );
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
    return normalEvents[eventId];
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
