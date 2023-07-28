import { eventStyle } from '../../helpers';
import { Draggable } from 'react-beautiful-dnd';

const Event = ({
  index,
  eventDayIndex,
  eventIndex,
  isEditMode,
  handleEdit,
}) => {
  const displayHourAndEventTitle = (event) => {
    return !event.startHour && !event.endHour
      ? event.title
      : event.endHour
      ? `${event.startHour}-${event?.endHour} ${event.title}`
      : `${event.startHour} ${event.title}`;
  };

  const makeEventWidth = (event) => {
    return (
      (new Date(event.endDate).getDate() -
        new Date(event.startDate).getDate() +
        1) *
        100 +
      5.5 *
        (new Date(event.endDate).getDate() -
          new Date(event.startDate).getDate())
    );
  };

  return (
    <Draggable
      key={`key-${index}`}
      draggableId={`day-${eventDayIndex.id}`}
      index={eventIndex}
      isDragDisabled={isEditMode ? false : true}
    >
      {(provided) => (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
        <section
          key={`key-ev-${index}`}
          onClick={() => {
            handleEdit(eventDayIndex.id, eventDayIndex.recursive);
          }}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div
            className={eventStyle(eventDayIndex)}
            style={{
              width: `${makeEventWidth(eventDayIndex)}%`,
            }}
          >
            {displayHourAndEventTitle(eventDayIndex)}
          </div>
        </section>
      )}
    </Draggable>
  );
};

export default Event;
