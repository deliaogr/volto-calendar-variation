import { Droppable } from 'react-beautiful-dnd';

const Events = ({ events, hourIndex, hour, handleCreate }) => {
  return (
    <section key={hourIndex}>
      <Droppable droppableId={`${hourIndex}`}>
        {(provided) => (
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
          <div
            className="dayWeekView"
            {...provided.droppableProps}
            ref={provided.innerRef}
            onClick={() =>
              handleCreate(hour.year, hour.month - 1, hour.dayNumber, hour.hour)
            }
          >
            <div>{provided.placeholder}</div>
            {events}
          </div>
        )}
      </Droppable>
    </section>
  );
};

export default Events;
