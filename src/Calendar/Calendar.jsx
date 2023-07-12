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
      <div className="calendar-container">
        <View
          {...{
            selectedView,
            setSelectedView,
            viewNames,
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
    </div>
  );
};

export default Calendar;
