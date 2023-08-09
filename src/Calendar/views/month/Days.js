import React from 'react';
import Day from './Day';

const Days = ({ days, handleEdit, eventsMatrix, isEditMode }) => {
  return days.map((day, dayIndex) => (
    <Day
      {...{
        dayIndex,
        day,
        handleEdit,
        eventsMatrix,
        isEditMode,
      }}
      key={dayIndex}
    />
  ));
};

export default Days;
