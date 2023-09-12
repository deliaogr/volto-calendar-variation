import React, { useState } from 'react';
import './coursesCalendar.css';
import * as views from './views';

const viewNames = Object.keys(views);

const Calendar = ({
  handleEdit,
  handleDrop,
  setInterval,
  makeDefaultEvent,
  // updateEvent,
  isEditMode,
  eventsInInterval: events,
  initial_view,
  user_select_view,
  initial_date,
  setIsRecEventModalOpen,
}) => {
  const [selectedView, setSelectedView] = useState(initial_view);

  const View = views[selectedView];

  return (
    <div className="calendar-container">
      <View
        {...{
          selectedView,
          setSelectedView,
          viewNames,
          handleEdit,
          handleDrop,
          events,
          setInterval,
          // updateEvent,
          makeDefaultEvent,
          isEditMode,
          user_select_view,
          initial_date,
          setIsRecEventModalOpen,
        }}
      />
    </div>
  );
};

export default Calendar;
