import { Droppable } from 'react-beautiful-dnd';
import moment from 'moment';
import { makeEventsList } from '../helpers';

const EventsList = ({
  eventsMatrix,
  hourIndex,
  hour,
  handleCreate,
  isEditMode,
  handleEdit,
}) => {
  const date = moment(`${hour.year}, ${hour.month}, ${hour.dayNumber}`).format(
    'YYYY-MM-DD',
  );

  const eventTitle = (event) => {
    return !event.startHour && !event.endHour
      ? event.title
      : event.endHour
      ? `${event.startHour}-${event?.endHour} ${event.title}`
      : `${event.startHour} ${event.title}`;
  };

  const eventsList = makeEventsList(
    eventsMatrix,
    date,
    hour,
    eventTitle,
    isEditMode,
    handleEdit,
  );

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
            {eventsList}
          </div>
        )}
      </Droppable>
    </section>
  );
};

export default EventsList;
