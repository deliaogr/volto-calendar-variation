import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import Events from './events/Events';
import { eventStyle } from '../helpers';
import moment from 'moment';

const Hour = ({
  hourIndex,
  handleCreate,
  hour,
  handleEdit,
  eventsMatrix,
  weekEventsMatrix,
  isEditMode,
}) => {
  const date = moment(`${hour.year}, ${hour.month}, ${hour.dayNumber}`).format(
    'YYYY-MM-DD',
  );

  const highestIndexWithoutHour = () => {
    return eventsMatrix[date]
      ? parseInt(Object.keys(eventsMatrix[date]).sort().reverse()[0])
      : 0;
  };

  const highestIndexWithHour = () => {
    return weekEventsMatrix[date]
      ? parseInt(Object.keys(weekEventsMatrix[date]).sort().reverse()[0])
      : 0;
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

  const hourIndicators = (hour) => {
    return hour >= 0 && `${moment(hour, 'HH').format('HH')}:00`;
  };

  const displayHourAndEventTitle = (event) => {
    return event.endHour
      ? `${event.startHour}-${event?.endHour} ${event.title}`
      : `${event.startHour} ${event.title}`;
  };

  const eventsListWithoutHour = hour.events ? (
    hour.events.length === 0 ? (
      []
    ) : (
      Array(highestIndexWithoutHour() + 1)
        .fill(0)
        .map((_, index) => {
          const indexEvent = hour.events
            .map((event) => event.id)
            .indexOf(eventsMatrix[date]?.[index]?.id);
          return indexEvent > -1 ? (
            <Draggable
              key={`key-${index}`}
              draggableId={`day-${eventsMatrix[date][index].id}`}
              index={indexEvent}
              isDragDisabled={isEditMode ? false : true}
            >
              {(provided) => (
                // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
                <section
                  key={`key-ev-${index}`}
                  onClick={() => {
                    handleEdit(
                      eventsMatrix[date][index].id,
                      eventsMatrix[date][index]?.recursive,
                    );
                  }}
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                >
                  <div
                    className={eventStyle(eventsMatrix[date][index])}
                    style={{
                      width: `${makeEventWidth(eventsMatrix[date][index])}%`,
                    }}
                  >
                    {eventsMatrix[date][index].title}
                  </div>
                </section>
              )}
            </Draggable>
          ) : (
            <section key={`key-${index}`} className="empty-cell"></section>
          );
        })
    )
  ) : (
    <div></div>
  );

  const eventsListWithHour = hour.events ? (
    hour.events.length === 0 ? (
      []
    ) : (
      Array(highestIndexWithHour() + 1)
        .fill(0)
        .map((_, index) => {
          const indexEvent = hour.events
            .map((event) => event.id)
            .indexOf(weekEventsMatrix[date]?.[index]?.id);
          return indexEvent > -1 ? (
            <Draggable
              key={`key-${index}`}
              draggableId={`day-${weekEventsMatrix[date][index].id}`}
              index={indexEvent}
              isDragDisabled={isEditMode ? false : true}
            >
              {(provided) => (
                // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
                <section
                  key={`key-ev-${index}`}
                  onClick={() => {
                    handleEdit(
                      weekEventsMatrix[date][index].id,
                      weekEventsMatrix[date][index].recursive,
                    );
                  }}
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                >
                  <div
                    className={eventStyle(weekEventsMatrix[date][index])}
                    style={{
                      width: `${makeEventWidth(
                        weekEventsMatrix[date][index],
                      )}%`,
                    }}
                  >
                    {displayHourAndEventTitle(weekEventsMatrix[date][index])}
                  </div>
                </section>
              )}
            </Draggable>
          ) : // <section key={`key-${index}`} className="empty-cell"></section>
          null;
        })
    )
  ) : (
    <div className="dayWeekView">{hourIndicators(hour.hour)}</div>
  );

  return hour.events ? (
    hour.hour < 0 ? (
      <Events {...{ eventsListWithoutHour, hourIndex, hour, handleCreate }} />
    ) : (
      // <section key={hourIndex}>
      <Events {...{ eventsListWithHour, hourIndex, hour, handleCreate }} />
      // </section>
    )
  ) : (
    eventsListWithHour
  );
};

export default Hour;
