import { Droppable } from 'react-beautiful-dnd';
import moment from 'moment';
import Event from './Event';

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

  const numberOfEventsInDay = () => {
    return eventsMatrix[date]
      ? parseInt(Object.keys(eventsMatrix[date]).sort().reverse()[0]) + 1
      : 0;
  };

  const events = hour.events
    ? hour.events.length === 0
      ? []
      : Array(numberOfEventsInDay())
          .fill(0)
          .map((_, index) => {
            const eventIndex = hour.events
              .map((event) => event.id)
              .indexOf(eventsMatrix[date]?.[index]?.id);
            const eventDayIndex = eventsMatrix[date]?.[index];

            return eventIndex > -1 ? (
              <Event
                {...{
                  index,
                  eventDayIndex,
                  eventIndex,
                  isEditMode,
                  handleEdit,
                }}
              />
            ) : // <section key={`key-${index}`} className="empty-cell"></section>
            null;
          })
    : null;

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

export default EventsList;
