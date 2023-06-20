import React from 'react';
import Day from './Day';

const Days = ({
  daysOfTheMonth,
  handleCreate,
  handleEdit,
  eventsMatrix,
  isEditMode,
}) => {
  return daysOfTheMonth.map((dayOfTheMonth, dayIndex) => (
    <Day
      {...{
        dayIndex,
        dayOfTheMonth,
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
