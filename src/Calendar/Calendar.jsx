import React, { useState } from 'react';
import './coursesCalendar.css';
import * as views from './views';
import { INITIAL_VIEW } from './constants';

const viewNames = Object.keys(views);

const Calendar = ({
  // ModalPopUp,
  // handleOpenModal,
  setInterval,
  getCurrentEventById,
  makeDefaultEvent,
  updateEvent,
  isEditMode,
  eventsInInterval: events,
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
            events,
            setInterval,
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
