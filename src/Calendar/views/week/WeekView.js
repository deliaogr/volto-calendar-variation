import React, { useState, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { DAYS_OF_THE_WEEK_WEEK_VIEW } from '../../constants';
import { firstAndLastDayOfTheWeek } from './utils/firstAndLastDayOfTheWeek';
import { fillCalendarDays } from './utils/fillCalendarDays';
import Hours from './Hours';
import { makeInterval } from './utils/makeInterval';
// import { removeDraggedEvent, addDroppedEvent } from '../helpers';
import { onDragEnd } from '../helpers';
import moment from 'moment';
import eventsMatrix from '../month/utils/eventsMatrix';
import { withViewSelector } from '../ViewSelector/withViewSelector';

const Week = ({
  // ModalPopUp,
  handleEdit,
  setIntervalForNewEvents,
  updateEvent,
  // handleOpenModal,
  makeDefaultEvent,
  isEditMode,
  allEvents = [],
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

  const updateEventDates = (event, destinationDay, updateEvent) => {
    const daysDiff =
      new Date(event.endDate).getTime() - new Date(event.startDate).getTime();

    const hoursDiff = event.endHour
      ? moment(event.endHour, 'HH:mm').format('HH') -
        moment(event.startHour, 'HH:mm').format('HH')
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
      destinationDay.hour !== -1 && event.endHour
        ? moment(destinationDay.hour + hoursDiff, 'H').format('HH:mm')
        : null;

    return updateEvent({ ...event, startDate, endDate, startHour, endHour });
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
        onDragEnd={(dragResult) =>
          onDragEnd(
            dragResult,
            weekHours,
            setWeekHours,
            updateEvent,
            updateEventDates,
          )
        }
        enableDefaultSensors={isEditMode ? true : false}
      >
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

export default withViewSelector(Week);
