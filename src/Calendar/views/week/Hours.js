import React from 'react';
import Hour from './Hour';

const Hours = ({
  weekHours,
  handleCreate,
  handleEdit,
  fullDayEventsMatrix,
  hourEventsMatrix,
  isEditMode,
}) => {
  return weekHours.map((hour, hourIndex) => (
    <Hour
      {...{
        hourIndex,
        handleCreate,
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
