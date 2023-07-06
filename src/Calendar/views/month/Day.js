import React, { useState } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { eventStyle } from '../helpers';
import moment from 'moment';
import Popup from './Popup';

// TODO: separate logic from implementation
const Day = ({
  dayIndex,
  day,
  handleCreate,
  handleEdit,
  eventsMatrix = {},
  isEditMode,
}) => {
  // TODO: rename
  const [isOpen, setIsOpen] = useState(false);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  // TODO: rename
  const date = moment(`${day.year}, ${day.month}, ${day.dayNumber}`).format(
    'YYYY-MM-DD',
  );

  const highestIndex = () => {
    const res = eventsMatrix?.[date]
      ? parseInt(Object.keys(eventsMatrix?.[date]).sort().reverse()[0])
      : 0;
    return res;
  };

  const endDateStartDateDiff = (endDate) => {
    const extensionDiff =
      (new Date(endDate).getTime() - new Date(date).getTime()) /
      (1000 * 3600 * 24);
    const isSunday = new Date(date).getDay() === 0;
    const moreThanOneWeek = extensionDiff > 7 - new Date(date).getDay();
    return isSunday
      ? 1
      : moreThanOneWeek
      ? 7 - new Date(date).getDay() + 1
      : extensionDiff + 1;
  };

  const makeEventWidth = (event) => {
    const width = event
      ? endDateStartDateDiff(event.endDate) * 100 +
        5.5 * (endDateStartDateDiff(event.endDate) - 1)
      : 0;
    return width;
  };

  const displayEvents = (event, index) => {
    const result = event
      ? endDateStartDateDiff(event.endDate, event.startDate) > 1
        ? event.title
        : event.startHour
        ? `${event?.startHour} ${event.title}`
        : event.title
      : 0;
    return result;
  };

  const isEventFromPreviousDayOnSunday = (index) => {
    const currentDay = new Date(date);
    const previousDay = new Date(date);
    previousDay.setDate(previousDay.getDate() - 1);
    const prevDayFormat = moment(previousDay).format('YYYY-MM-DD');
    // if current day is monday and there is an event on previous day(sunday) at the current index from map
    // and also continues to the current day, then return true
    return currentDay.getDay() === 1 && eventsMatrix[prevDayFormat]?.[index];
  };

  const eventExtendsOnMonday = (event) => {
    const currentDay = new Date(date);
    const currentDayWeekIndex = moment(currentDay).format('W');
    const endDateWeekIndex = moment(event?.endDate).format('W');
    return endDateWeekIndex !== currentDayWeekIndex;
  };

  const isEventActiveRight = (event) => {
    return new Date(event?.endDate).getTime() > new Date().getTime()
      ? 'triangle-right-active'
      : 'triangle-right-past';
  };

  const isEventActiveLeft = (event) => {
    return new Date(event?.endDate).getTime() > new Date().getTime()
      ? 'triangle-left-active'
      : 'triangle-left-past';
  };

  const eventsList = !eventsMatrix?.[date]
    ? []
    : Array(highestIndex() + 1)
        .fill(0)
        .map((_, index) => {
          const indexEvent = day?.events
            .map((event) => event.id)
            .indexOf(eventsMatrix?.[date]?.[index]?.id);
          return indexEvent > -1 ? (
            <Draggable
              key={`key-${index}`}
              draggableId={`day-${eventsMatrix?.[date][index].id}-${date}`}
              index={indexEvent}
              isDragDisabled={isEditMode ? false : true}
            >
              {(provided) => (
                // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
                <section
                  key={`key-ev-${index}`}
                  onClick={() => {
                    handleEdit(
                      eventsMatrix?.[date][index].id,
                      eventsMatrix?.[date][index]?.recursive,
                    );
                  }}
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                >
                  {eventExtendsOnMonday(eventsMatrix?.[date][index]) ? (
                    <div
                      key={`key-div-${index}`}
                      className="line-up"
                      style={{
                        width: `${makeEventWidth(
                          eventsMatrix?.[date][index],
                        )}%`,
                      }}
                    >
                      <div
                        className={eventStyle(eventsMatrix?.[date][index])}
                        style={{
                          width: `${makeEventWidth(
                            eventsMatrix?.[date][index],
                          )}%`,
                          borderTopRightRadius: '0px',
                          borderBottomRightRadius: '0px',
                        }}
                      >
                        {displayEvents(eventsMatrix?.[date][index], indexEvent)}
                      </div>
                      <div
                        className={isEventActiveRight(
                          eventsMatrix?.[date][index],
                        )}
                      ></div>
                    </div>
                  ) : (
                    <div
                      key={`key-div-${index}`}
                      className={eventStyle(eventsMatrix?.[date][index])}
                      style={{
                        width: `${makeEventWidth(
                          eventsMatrix?.[date][index],
                        )}%`,
                      }}
                    >
                      {displayEvents(eventsMatrix?.[date][index], indexEvent)}
                    </div>
                  )}
                </section>
              )}
            </Draggable>
          ) : isEventFromPreviousDayOnSunday(index) ? (
            <div
              className="line-up"
              style={{
                width: `${makeEventWidth(eventsMatrix?.[date][index])}%`,
              }}
              key={`key-div-${index}`}
            >
              <div
                className={isEventActiveLeft(eventsMatrix?.[date][index])}
              ></div>
              <section
                className={eventStyle(eventsMatrix?.[date][index])}
                style={{
                  width: `${makeEventWidth(eventsMatrix?.[date][index])}%`,
                  borderTopLeftRadius: '0px',
                  borderBottomLeftRadius: '0px',
                }}
              >
                {eventsMatrix?.[date][index]?.title}
              </section>
            </div>
          ) : (
            <section key={`key-${index}`} className="empty-cell"></section>
          );
        });

  const displayDay = (day) => {
    return day.year === new Date().getFullYear() &&
      day.month === new Date().getMonth() + 1 &&
      day.dayNumber === new Date().getDate() ? (
      <div
        style={{
          width: '18px',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          textAlign: 'center',
          color: 'white',
          borderRadius: '50%',
          fontWeight: '500',
          marginBottom: '2px',
        }}
      >
        {day.dayNumber}
      </div>
    ) : (
      <div
        style={{
          marginBottom: '2px',
        }}
      >
        {day.dayNumber}
      </div>
    );
  };

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
            <div
              key={`key-div-${dayIndex}`}
              onClick={() => {
                handleCreate(day.year, day.month - 1, day.dayNumber);
              }}
            >
              {displayDay(day)}
              {provided.placeholder}
            </div>
            {eventsList.length < 4 ? (
              eventsList
            ) : (
              <>
                {/* show only the first three events */}
                {eventsList.slice(0, 3)}
                <button
                  className="see-more-btn"
                  key={`key-btn-${dayIndex}`}
                  onClick={togglePopup}
                >
                  + see more
                </button>
                {isOpen && (
                  <Popup
                    {...{
                      events: Object.values(eventsMatrix?.[date]),
                      setIsOpen: togglePopup,
                      monthForPopUp: day.month,
                      dayForPopUp: day.dayNumber,
                      yearForPopUp: day.year,
                      handleEdit,
                    }}
                  />
                )}
              </>
            )}
          </div>
        </section>
      )}
    </Droppable>
  );
};

export default Day;
