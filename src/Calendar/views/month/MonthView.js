import React, { useState, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { DAYS_OF_THE_WEEK_MONTH_VIEW } from '../../constants';
import Days from './Days';
import { makeIntervalToFetchMonthEvents } from './utils/makeIntervalToFetchMonthEvents';
import { fillCalendarDays } from './utils/fillCalendarDays';
import moment from 'moment';
import { removeDraggedEvent, addDroppedEvent } from '../helpers';
import { makeInterval } from '../week/utils/makeInterval';
import eventsMatrix from './utils/eventsMatrix';

const Month = ({
  // ModalPopUp,
  handleEdit,
  setIntervalForNewEvents,
  updateEvent,
  // handleOpenModal,
  makeDefaultEvent,
  isEditMode,
  allEvents = [],
  // part of refactoring
  selectedPeriod: selectedMonth,
  selectedYear,
}) => {

  const [days, setDays] = useState(
    fillCalendarDays(new Date().getMonth(), allEvents, selectedYear),
  );

  const [eventsMatrixState, setEventsMatrixState] = useState(
    eventsMatrix(allEvents),
  );

  const dayNames = DAYS_OF_THE_WEEK_MONTH_VIEW.map((dayOfTheWeek, i) => (
    <span key={`key-${i}`} className="day-name">
      {dayOfTheWeek}
    </span>
  ));

  const updateEventDates = (eventToMove, destinationDay, updateEvent) => {
    const { id, title, startHour, endHour, recursive } = eventToMove;
    const daysDiff =
      new Date(eventToMove.endDate).getTime() -
      new Date(eventToMove.startDate).getTime();
    const startDate = moment([
      destinationDay.year,
      destinationDay.month - 1,
      destinationDay.dayNumber,
    ]).format('YYYY-MM-DD');
    const endDate = moment(new Date(startDate).getTime() + daysDiff).format(
      'YYYY-MM-DD',
    );
    return updateEvent({
      id,
      title,
      startDate,
      endDate,
      startHour,
      endHour,
      recursive,
    });
  };

  /**
   * Move the event to different destination at selected position or keep it in place
   * (will not reorder if source is the same as destination)
   * ex: source has droppableId: 1 and index: 0, destination has droppableId: 3 and index: 1
   * [{name: 1, events: [a,b]}, {name: 2, events: [*a,b]}, {name: 3, events: [a,b]},
   * {name: 4, events: [a,*a,b]}, {name: 5, events: [a,b]}]
   * @param {Object} dragResult
   * @param {Object} dragResult.destination
   * @param {String} dragResult.destination.droppableId
   * @param {Number} dragResult.destination.index
   * @param {Object} dragResult.source
   * @param {String} dragResult.source.droppableId
   * @param {Number} dragResult.source.index
   * @returns
   */
  const onDragEnd = (dragResult) => {
    const { source, destination } = dragResult;
    // if destination is not droppable or source is the same as destination, it will be kept in place
    if (!destination || destination?.droppableId === source?.droppableId) {
      return;
    }
    // make copy to make it safe to mutate, the source won't be changed
    const allDaysCurrentMonth = days.slice();
    const sourceDay = allDaysCurrentMonth[source.droppableId];
    const destinationDay = allDaysCurrentMonth[destination.droppableId];
    const eventToMove = sourceDay.events[source.index];
    // replacing item in array is safe to mutate,
    // it won't change the original source
    allDaysCurrentMonth[source.droppableId] = {
      ...sourceDay,
      events: removeDraggedEvent(sourceDay, source),
    };
    allDaysCurrentMonth[destination.droppableId] = {
      ...destinationDay,
      events: addDroppedEvent(
        destinationDay,
        eventToMove,
        destination,
        allEvents,
      ),
    };
    updateEventDates(eventToMove, destinationDay, updateEvent);
    setDays(allDaysCurrentMonth);
  };

  const handleCreate = (year, month, day) => {
    makeDefaultEvent(makeInterval(year, month, day, year, month, day));
    // handleOpenModal();
  };

  useEffect(() => {
    setIntervalForNewEvents(
      makeIntervalToFetchMonthEvents(selectedMonth, selectedYear, []),
    );
  }, []);

  useEffect(() => {
    setDays(fillCalendarDays(selectedMonth.key, allEvents, selectedYear));
  }, [allEvents, selectedMonth.key, selectedYear]);

  useEffect(() => {
    setEventsMatrixState(eventsMatrix(allEvents));
  }, [allEvents]);

  return (
    <div>
      <DragDropContext
        onDragEnd={onDragEnd}
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

export default Month;
