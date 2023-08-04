import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { displayDayNumbers } from './utils/displayDayNumbers';
import EventsList from './EventsList';

const Day = ({
  dayIndex,
  day,
  handleCreate,
  handleEdit,
  eventsMatrix = {},
  isEditMode,
}) => {
  return (
    <Droppable droppableId={`${dayIndex}`} key={`key-drop-${dayIndex}`}>
      {(provided) => (
        <section
          key={`section-${dayIndex}`}
          className={day.class}
          {...provided.droppableProps}
          ref={provided.innerRef}
        >
          <div key={`key-${dayIndex}`}>
            {displayDayNumbers(day, dayIndex, provided)}
            <EventsList
              {...{
                eventsMatrix,
                dayIndex,
                day,
                handleCreate,
                isEditMode,
                handleEdit,
              }}
            />
          </div>
        </section>
      )}
    </Droppable>
  );
};

export default Day;
