import { Draggable } from 'react-beautiful-dnd';
import { eventExtendsOnMonday } from '../helpers';
import EventPointingRight from './EventPointingRight';
import NonPointingEvent from './NonPointingEvent';

// this event starts in the current week, it is not extended from sunday
const EventFromCurrentWeek = ({
  index,
  event,
  eventTitle,
  eventIndex,
  date,
  isEditMode,
  handleEdit,
}) => {
  return (
    <Draggable
      key={`key-${index}`}
      draggableId={`day-${event.id}-${date}`}
      index={eventIndex}
      isDragDisabled={isEditMode ? false : true}
    >
      {(provided) => (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
        <section
          key={`key-ev-${index}`}
          onClick={() => {
            handleEdit(event.id, event?.recursive);
          }}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {eventExtendsOnMonday(event, date) ? (
            <EventPointingRight
              {...{
                index,
                event,
                eventTitle,
                date,
              }}
            />
          ) : (
            <NonPointingEvent
              {...{
                index,
                event,
                eventTitle,
                date,
              }}
            />
          )}
        </section>
      )}
    </Draggable>
  );
};

export default EventFromCurrentWeek;
