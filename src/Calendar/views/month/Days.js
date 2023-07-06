import React from 'react';
import Day from './Day';

const Days = ({ days, handleCreate, handleEdit, eventsMatrix, isEditMode }) => {
  return days.map((day, dayIndex) => (
    <Day
      {...{
        dayIndex,
        day,
        handleCreate,
        handleEdit,
        eventsMatrix,
        isEditMode,
      }}
      key={dayIndex}
    />
  ));
};

export default Days;
