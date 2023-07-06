import React, { useState } from 'react';
import './coursesCalendar.css';
import * as views from './views';
import { INITIAL_VIEW } from './constants';

const viewNames = Object.keys(views);

const Calendar = ({
  // ModalPopUp,
  // handleOpenModal,
  setIntervalForNewEvents,
  getCurrentEventById,
  makeDefaultEvent,
  updateEvent,
  isEditMode,
  allEventsInInterval: allEvents,
}) => {
  const [selectedView, setSelectedView] = useState(INITIAL_VIEW);

  const View = views[selectedView];

  const handleEdit = (eventId) => {
    getCurrentEventById(eventId);
    // handleOpenModal();
  };

  return (
    <div>
      {/* TODO: add ViewSelector */}
      <View
        {...{
          selectedView,
          viewNames,
          setSelectedView,
          // ModalPopUp,
          handleEdit,
          allEvents,
          setIntervalForNewEvents,
          updateEvent,
          // handleOpenModal,
          makeDefaultEvent,
          isEditMode,
        }}
      />
    </div>
  );
};

export default Calendar;
