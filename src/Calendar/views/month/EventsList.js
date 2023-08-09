import React, { useState } from 'react';
import moment from 'moment';
import Popup from './Popup';
import { eventTimeSpan, makeEventsList } from '../helpers';

const EventsList = ({
  eventsMatrix,
  dayIndex,
  day,
  isEditMode,
  handleEdit,
}) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const date = moment(`${day.year}, ${day.month}, ${day.dayNumber}`).format(
    'YYYY-MM-DD',
  );

  const eventTitle = (event) => {
    return event
      ? eventTimeSpan(event, date) > 1
        ? event.title
        : event.startHour
        ? `${event?.startHour} ${event.title}`
        : event.title
      : 0;
  };

  const eventsList = makeEventsList(
    eventsMatrix,
    date,
    day,
    eventTitle,
    isEditMode,
    handleEdit,
  );

  return (
    <>
      {/* first 3 events are always shown */}
      {eventsList.slice(0, 3)}
      {/* if there are more than 3 events, we show them in a modal */}
      {eventsList.length > 3 && (
        <button
          className="see-more-btn"
          key={`key-btn-${dayIndex}`}
          onClick={togglePopup}
        >
          + see more
        </button>
      )}
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
  );
};

export default EventsList;
