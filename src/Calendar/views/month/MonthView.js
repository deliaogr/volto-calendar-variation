import React, { useState, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { DAYS_OF_THE_WEEK_MONTH_VIEW } from '../../constants';
import Days from './Days';
import { makeInterval } from './utils/makeInterval';
import { fillCalendarDays } from './utils/fillCalendarDays';
import moment from 'moment';
import { onDragEnd } from '../helpers';
// import { makeInterval } from '../week/utils/makeInterval';
import eventsMatrix from './utils/eventsMatrix';
import { withViewSelector } from '../ViewSelector/withViewSelector';

const Month = ({
  // ModalPopUp,
  handleEdit,
  setInterval,
  updateEvent,
  // handleOpenModal,
  makeDefaultEvent,
  isEditMode,
  events = [],
  selectedPeriod: selectedMonth,
  selectedYear,
}) => {
  const [days, setDays] = useState(
    fillCalendarDays(selectedMonth.key, events, selectedYear),
  );

  const [eventsMatrixState, setEventsMatrixState] = useState(
    eventsMatrix(events),
  );
  console.log(eventsMatrix(events));

  const dayNames = DAYS_OF_THE_WEEK_MONTH_VIEW.map((dayOfTheWeek, i) => (
    <span key={`key-${i}`} className="day-name">
      {dayOfTheWeek}
    </span>
  ));

  const updateEventDates = (event, destinationDay, updateEvent) => {
    const daysDiff =
      new Date(event.endDate).getTime() - new Date(event.startDate).getTime();

    const startDate = moment([
      destinationDay.year,
      destinationDay.month - 1,
      destinationDay.dayNumber,
    ]).format('YYYY-MM-DD');

    const endDate = moment(new Date(startDate).getTime() + daysDiff).format(
      'YYYY-MM-DD',
    );

    return updateEvent({
      ...event,
      startDate,
      endDate,
    });
  };

  const handleCreate = (year, month, day) => {
    // makeDefaultEvent(makeInterval(year, month, day, year, month, day));
    // handleOpenModal();
  };

  useEffect(() => {
    setInterval(makeInterval(selectedMonth, selectedYear, []));
  }, []);

  useEffect(() => {
    setDays(fillCalendarDays(selectedMonth.key, events, selectedYear));
    setEventsMatrixState(eventsMatrix(events));
  }, [events, selectedMonth.key, selectedYear]);

  return (
    <div>
      <DragDropContext
        onDragEnd={(dragResult) =>
          onDragEnd(dragResult, days, setDays, updateEvent, updateEventDates)
        }
        enableDefaultSensors={isEditMode ? true : false}
      >
        <div className="calendar">
          {dayNames}
          <Days
            {...{
              days,
              handleCreate,
              handleEdit,
              eventsMatrix: eventsMatrixState,
              isEditMode,
            }}
          />
        </div>
        {/* <ModalPopUp /> */}
      </DragDropContext>
    </div>
  );
};

export default withViewSelector(Month);
