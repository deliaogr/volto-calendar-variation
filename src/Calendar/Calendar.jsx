import React, { useState } from 'react';
import './coursesCalendar.css';
import * as views from './views';
import { INITIAL_VIEW } from './constants';

const viewNames = Object.keys(views);

const Calendar = ({
  handleEdit,
  setInterval,
  makeDefaultEvent,
  updateEvent,
  isEditMode,
  eventsInInterval: events,
}) => {
  const [selectedView, setSelectedView] = useState(INITIAL_VIEW);

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
          }}
        />
      </div>
    </div>
  );
};

export default Calendar;
