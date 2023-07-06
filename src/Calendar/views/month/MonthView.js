import React, { useState, useEffect } from 'react';
import ViewSelector from '../ViewSelector';
import { DragDropContext } from 'react-beautiful-dnd';
import { DAYS_OF_THE_WEEK_MONTH_VIEW, MONTHS } from '../../constants';
import Days from './Days';
import { makeIntervalToFetchMonthEvents } from './helpers/makeIntervalToFetchMonthEvents';
import { fillCalendarDays } from './helpers/fillCalendarDays';
import moment from 'moment';
import { removeDraggedEvent, addDroppedEvent } from '../helpers';
import { makeInterval } from '../week/helpers/makeInterval';
import eventsMatrix from './helpers/eventsMatrix';

const Month = ({
  viewNames,
  setSelectedView,
  // ModalPopUp,
  handleEdit,
  setIntervalForNewEvents,
  updateEvent,
  // handleOpenModal,
  makeDefaultEvent,
  isEditMode,
  allEvents = [],
}) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setCurrentMonth] = useState(
    MONTHS[new Date().getMonth()],
  );

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

  const setNextYear = () => {
    const year = selectedYear + 1;
    setSelectedYear(year);
    onChangeMonth(MONTHS[0], year);
  };

  const setPreviousYear = () => {
    const year = selectedYear - 1;
    setSelectedYear(year);
    onChangeMonth(MONTHS[11], year);
  };

  const onChangeMonth = (monthSelection, year) => {
    setCurrentMonth(monthSelection);
    setIntervalForNewEvents(
      makeIntervalToFetchMonthEvents(monthSelection, year, []),
    );
  };

  const handlePreviousMonth = () => {
    selectedMonth.key > 0
      ? onChangeMonth(MONTHS[selectedMonth.key - 1], selectedYear)
      : setPreviousYear();
  };

  const handleNextMonth = () => {
    selectedMonth.key < 11
      ? onChangeMonth(MONTHS[selectedMonth.key + 1], selectedYear)
      : setNextYear();
  };

  const handleToday = () => {
    setSelectedYear(new Date().getFullYear());
    const year = new Date().getFullYear();
    onChangeMonth(MONTHS[new Date().getMonth()], year);
  };

  const handleCreate = (year, month, day) => {
    makeDefaultEvent(makeInterval(year, month, day, year, month, day));
    // handleOpenModal();
  };

  // TODO: rename & remove
  const displayMonth = (
    <div className="dropdown">
      <button className="dropbtn">
        {selectedMonth.text} {selectedYear}
      </button>
      <div className="dropdown-content">
        {MONTHS.map((month, index) => (
          // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events
          <p
            key={`key-${index}`}
            onClick={() => onChangeMonth(MONTHS[month.key], selectedYear)}
            className="dropdown-content-btn"
          >
            {month.text} {selectedYear}
          </p>
        ))}
      </div>
    </div>
  );

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
        <div className="calendar-container">
          {/* TODO: remove */}
          <ViewSelector
            {...{ selectedView: 'Month', viewNames, setSelectedView }}
            handleChangePrevious={handlePreviousMonth}
            handleChangeNext={handleNextMonth}
            handleToday={handleToday}
          >
            {displayMonth}
          </ViewSelector>
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
        </div>
      </DragDropContext>
    </div>
  );
};

export default Month;
