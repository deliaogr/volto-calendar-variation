import React, { useState } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { displayDayNumbers } from './utils/displayDayNumbers';
import EventPointingLeft from './events/EventPointingLeft';
import EventFromCurrentWeek from './events/EventFromCurrentWeek';
import moment from 'moment';
import Popup from './Popup';

const Day = ({
  dayIndex,
  day,
  handleCreate,
  handleEdit,
  eventsMatrix = {},
  isEditMode,
}) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const date = moment(`${day.year}, ${day.month}, ${day.dayNumber}`).format(
    'YYYY-MM-DD',
  );

  const numberOfEventsInDay = () => {
    return eventsMatrix?.[date]
      ? parseInt(Object.keys(eventsMatrix?.[date]).sort().reverse()[0]) + 1
      : 0;
  };

  const eventTimeSpan = (endDate) => {
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
    return event
      ? eventTimeSpan(event.endDate) * 100 +
          5.5 * (eventTimeSpan(event.endDate) - 1)
      : 0;
  };

  const isPreviousEventDayOnSunday = (index) => {
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

  const eventsList = !eventsMatrix?.[date]
    ? []
    : Array(numberOfEventsInDay())
        .fill(0)
        .map((_, index) => {
          // check if event exists
          const eventIndex = day?.events
            .map((event) => event.id)
            .indexOf(eventsMatrix?.[date]?.[index]?.id);
          const eventDayIndex = eventsMatrix?.[date][index];

          return eventIndex > -1 ? (
            <EventFromCurrentWeek
              {...{
                index,
                eventDayIndex,
                eventIndex,
                date,
                isEditMode,
                handleEdit,
                makeEventWidth,
                eventTimeSpan,
                eventExtendsOnMonday,
              }}
            />
          ) : isPreviousEventDayOnSunday(index) ? (
            <EventPointingLeft
              {...{
                index,
                eventDayIndex,
                makeEventWidth,
              }}
            />
          ) : (
            // day with no events
            <section key={`key-${index}`} className="empty-cell"></section>
          );
        });

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
            {/* TODO: implement better */}
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
                {isPopupOpen && (
                  <Popup
                    {...{
                      events: Object.values(eventsMatrix?.[date]),
                      setIsPopupOpen: togglePopup,
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
