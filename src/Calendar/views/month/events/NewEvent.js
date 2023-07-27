import { Draggable } from 'react-beautiful-dnd';
import EventPointingRight from './EventPointingRight';
import NonPointingEvent from './NonPointingEvent';

const NewEvent = ({
  index,
  eventDayIndex,
  eventIndex,
  date,
  isEditMode,
  handleEdit,
  makeEventWidth,
  eventTimeSpan,
  eventExtendsOnMonday,
}) => {
  const displayEvents = (event) => {
    return event
      ? eventTimeSpan(event.endDate, event.startDate) > 1
        ? event.title
        : event.startHour
        ? `${event?.startHour} ${event.title}`
        : event.title
      : 0;
  };

  return (
    <Draggable
      key={`key-${index}`}
      draggableId={`day-${eventDayIndex.id}-${date}`}
      index={eventIndex}
      isDragDisabled={isEditMode ? false : true}
    >
      {(provided) => (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
        <section
          key={`key-ev-${index}`}
          onClick={() => {
            handleEdit(eventDayIndex.id, eventDayIndex?.recursive);
          }}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {eventExtendsOnMonday(eventDayIndex) ? (
            <EventPointingRight
              {...{
                index,
                eventDayIndex,
                makeEventWidth,
                displayEvents,
              }}
            />
          ) : (
            <NonPointingEvent
              {...{
                index,
                eventDayIndex,
                makeEventWidth,
                displayEvents,
              }}
            />
          )}
        </section>
      )}
    </Draggable>
  );
};

export default NewEvent;
