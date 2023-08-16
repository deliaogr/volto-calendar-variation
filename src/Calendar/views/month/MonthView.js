import React, { useState, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { DAYS_OF_THE_WEEK_MONTH_VIEW } from '../../constants';
import Days from './Days';
import { makeInterval } from './utils/makeInterval';
import { fillCalendarDays } from './utils/fillCalendarDays';
import moment from 'moment';
import { onDragEnd } from '../helpers';
import eventsMatrix from './utils/eventsMatrix';
import { withViewSelector } from '../ViewSelector/withViewSelector';

const Month = ({
  handleEdit,
  setInterval,
  updateEvent,
  isEditMode,
  events = [],
  selectedPeriod: selectedMonth,
  selectedYear,
  setIsRecEventModalOpen,
}) => {
  const [days, setDays] = useState(
    fillCalendarDays(selectedMonth.key, events, selectedYear),
  );

  const [eventsMatrixState, setEventsMatrixState] = useState(
    eventsMatrix(events),
  );

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
          onDragEnd(
            dragResult,
            days,
            setDays,
            updateEvent,
            updateEventDates,
            setIsRecEventModalOpen,
          )
        }
        enableDefaultSensors={isEditMode ? true : false}
      >
        <div className="calendar">
          {dayNames}
          <Days
            {...{
              days,
              handleEdit,
              eventsMatrix: eventsMatrixState,
              isEditMode,
            }}
          />
        </div>
      </DragDropContext>
    </div>
  );
};

export default withViewSelector(Month);
