import React, { useState, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { DAYS_OF_THE_WEEK_WEEK_VIEW } from '../../constants';
import { firstAndLastDayOfTheWeek } from './utils/firstAndLastDayOfTheWeek';
import { fillCalendarDays } from './utils/fillCalendarDays';
import Hours from './Hours';
import { makeInterval } from './utils/makeInterval';
import { removeDraggedEvent, addDroppedEvent } from '../helpers';
import moment from 'moment';
import eventsMatrix from '../month/utils/eventsMatrix';

const Week = ({
  // ModalPopUp,
  handleEdit,
  setIntervalForNewEvents,
  updateEvent,
  // handleOpenModal,
  makeDefaultEvent,
  isEditMode,
  allEvents = [],
  // part of refactoring
  selectedPeriod: selectedWeek,
}) => {
  const fullDayEvents = allEvents.filter((event) => event.startHour === null);
  const hourEvents = allEvents.filter((event) => event.startHour !== null);

  const [weekHours, setWeekHours] = useState(
    fillCalendarDays(allEvents, firstAndLastDayOfTheWeek(new Date())),
  );

  const [eventsMatrixState, setEventsMatrixState] = useState(
    eventsMatrix(fullDayEvents),
  );

  const dayNames = DAYS_OF_THE_WEEK_WEEK_VIEW.map((dayOfTheWeek, i) => {
    return i === 0 ? (
      <span className="day-name" key={i}></span>
    ) : (
      <span key={`key-${i}`} className="day-name">
        {dayOfTheWeek} {weekHours[i].dayNumber}
      </span>
    );
  });

  const updateEventDates = (eventToMove, destinationDay, updateEvent) => {
    const { id, title } = eventToMove;
    const daysDiff =
      new Date(eventToMove.endDate).getTime() -
      new Date(eventToMove.startDate).getTime();
    const hoursDiff = eventToMove.endHour
      ? moment(eventToMove.endHour, 'HH:mm').format('HH') -
        moment(eventToMove.startHour, 'HH:mm').format('HH')
      : 1;
    const startDate = moment([
      destinationDay.year,
      destinationDay.month - 1,
      destinationDay.dayNumber,
    ]).format('YYYY-MM-DD');
    const endDate = moment(new Date(startDate).getTime() + daysDiff).format(
      'YYYY-MM-DD',
    );
    const startHour =
      destinationDay.hour !== -1
        ? moment(destinationDay.hour, 'H').format('HH:mm')
        : null;
    const endHour =
      destinationDay.hour !== -1 && eventToMove.endHour
        ? moment(destinationDay.hour + hoursDiff, 'H').format('HH:mm')
        : null;
    return updateEvent({ id, title, startDate, endDate, startHour, endHour });
  };

  const onDragEnd = (dragResult) => {
    const { source, destination } = dragResult;
    // if destination is not droppable or source is the same as destination, it will be kept in place
    if (!destination || destination?.droppableId === source?.droppableId) {
      return;
    }
    // make copy to make it safe to mutate, the source won't be changed
    const allDaysCurrentWeek = weekHours.slice();
    const sourceDay = allDaysCurrentWeek[source.droppableId];
    const destinationDay = allDaysCurrentWeek[destination.droppableId];
    const eventToMove = sourceDay.events[source.index];
    // replacing item in array is safe to mutate,
    // it won't change the original source
    allDaysCurrentWeek[source.droppableId] = {
      ...sourceDay,
      events: removeDraggedEvent(sourceDay, source),
    };
    allDaysCurrentWeek[destination.droppableId] = {
      ...destinationDay,
      events: addDroppedEvent(destinationDay, eventToMove, destination),
    };
    updateEventDates(eventToMove, destinationDay, updateEvent);
    setWeekHours(allDaysCurrentWeek);
  };

  const handleCreate = (year, month, day, startHour) => {
    makeDefaultEvent({
      ...makeInterval(year, month, day, year, month, day),
      startHour: moment(startHour, 'HH:mm'),
    });
    // handleOpenModal();
  };

  useEffect(() => {
    setIntervalForNewEvents(
      makeInterval(
        selectedWeek.startYear,
        selectedWeek.startMonth - 1,
        selectedWeek.startDay,
        selectedWeek.endYear,
        selectedWeek.endMonth - 1,
        selectedWeek.endDay,
      ),
    );
  }, []);

  useEffect(() => {
    setWeekHours(
      fillCalendarDays(
        allEvents,
        firstAndLastDayOfTheWeek(
          new Date(
            `${selectedWeek.startYear}/${selectedWeek.startMonth}/${selectedWeek.startDay}`,
          ),
        ),
      ),
    );
  }, [allEvents, selectedWeek]);

  useEffect(() => {
    setEventsMatrixState(eventsMatrix(allEvents));
  }, [allEvents]);

  return (
    <div>
      <DragDropContext
        onDragEnd={onDragEnd}
        enableDefaultSensors={isEditMode ? true : false}
      >
        {/* <div className="calendar-container"> */}
        {/* <ViewSelector
            {...{ selectedView: 'Week', viewNames, setSelectedView }}
            handleChangePrevious={handlePreviousWeek}
            handleChangeNext={handleNextWeek}
            handleToday={handleToday}
          >
            <div className="dropdown dropbtn">{displayWeeks(selectedWeek)}</div>
          </ViewSelector> */}
        <div className="hours-weekdays-wrapper">
          <div className="calendarWeekView">
            {dayNames}
            <Hours
              {...{
                weekHours,
                handleCreate,
                handleEdit,
                eventsMatrix: eventsMatrix(fullDayEvents),
                weekEventsMatrix: eventsMatrix(hourEvents),
                isEditMode,
              }}
            />
          </div>
        </div>
        {/* <ModalPopUp /> */}
        {/* </div> */}
      </DragDropContext>
    </div>
  );
};

export default Week;
