import React, { useState } from 'react';
import './coursesCalendar.css';
import * as views from './views';

const viewNames = Object.keys(views);

const Calendar = ({
  handleEdit,
  setInterval,
  makeDefaultEvent,
  updateEvent,
  isEditMode,
  eventsInInterval: events,
  initial_view,
  user_select_view,
  initial_date,
}) => {
  const [selectedView, setSelectedView] = useState(initial_view);

  const View = views[selectedView];

  return (
    <div>
      <div className="calendar-container">
        <View
          {...{
            selectedView,
            setSelectedView,
            viewNames,
            handleEdit,
            events,
            setInterval,
            updateEvent,
            makeDefaultEvent,
            isEditMode,
            user_select_view,
            initial_date,
          }}
        />
      </div>
    </div>
  );
};

export default Calendar;
