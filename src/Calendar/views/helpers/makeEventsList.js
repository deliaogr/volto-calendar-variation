import { numberOfEventsInDay } from './numberOfEventsInDay';
import { isEventFromLastWeek } from './isEventFromLastWeek';
import EventFromLastWeek from '../events/EventFromLastWeek';
import EventFromCurrentWeek from '../events/EventFromCurrentWeek';

const isCorrectHour = (cellData, event) => {
  const eventStartHour = event.startHour ?? false;
  const isWeekView = !isNaN(cellData.hour);

  const result = isWeekView ? cellData.hour === parseInt(eventStartHour) : true;
  return result;
};

export const makeEventsList = (
  eventsMatrix,
  date,
  cellData,
  eventTitle,
  isEditMode,
  handleEdit,
) => {
  return !eventsMatrix?.[date]
    ? []
    : Array(numberOfEventsInDay(eventsMatrix, date))
        .fill(0)
        .map((_, index) => {
          const eventIndex = cellData.events
            .map((event) => event.id)
            .indexOf(eventsMatrix[date]?.[index]?.id);
          const event = eventsMatrix[date]?.[index];

          return eventIndex > -1 ? (
            <EventFromCurrentWeek
              {...{
                index,
                event,
                eventTitle,
                eventIndex,
                date,
                isEditMode,
                handleEdit,
              }}
            />
          ) : isEventFromLastWeek(index, date, eventsMatrix) &&
            isCorrectHour(cellData, event) ? (
            <EventFromLastWeek
              {...{
                index,
                event,
                eventTitle,
                date,
              }}
            />
          ) : (
            // TODO: find out why empty cell doesn't work for week view
            // when an index has no event in week view, we leave no empty space
            // cellData.class.includes('weekDay') ? null : (
            // whereas in month view, we show an empty cellData to avoid overlapping events
            <section key={`key-${index}`} className="empty-cell"></section>
          );
          // );
        });
};
