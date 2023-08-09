import React from 'react';
import Hour from './Hour';

const Hours = ({
  weekHours,
  handleEdit,
  fullDayEventsMatrix,
  hourEventsMatrix,
  isEditMode,
}) => {
  return weekHours.map((hour, hourIndex) => (
    <Hour
      {...{
        hourIndex,
        hour,
        handleEdit,
        fullDayEventsMatrix,
        hourEventsMatrix,
        isEditMode,
      }}
      key={hourIndex}
    />
  ));
};

export default Hours;
