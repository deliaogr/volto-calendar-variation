import React from 'react';
import EventsList from './EventsList';
import moment from 'moment';

const Hour = ({
  hourIndex,
  hour,
  handleEdit,
  fullDayEventsMatrix,
  hourEventsMatrix,
  isEditMode,
}) => {
  const hourIndicators = (hour) => {
    return hour >= 0 && `${moment(hour, 'HH').format('HH')}:00`;
  };

  return hour.events ? (
    hour.hour < 0 ? (
      // full day events
      <EventsList
        {...{
          eventsMatrix: fullDayEventsMatrix,
          hourIndex,
          hour,
          isEditMode,
          handleEdit,
        }}
      />
    ) : (
      // events with start and end hour
      <EventsList
        {...{
          eventsMatrix: hourEventsMatrix,
          hourIndex,
          hour,
          isEditMode,
          handleEdit,
        }}
      />
    )
  ) : (
    <div className="dayWeekView">{hourIndicators(hour.hour)}</div>
  );
};

export default Hour;
