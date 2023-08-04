import { eventExtendsOnMonday } from '../helpers';
import EventPointingLeft from './EventPointingLeft';
import EventPointingLeftAndRight from './EventPointingLeftAndRight';

// this event starts in the previous week, it is extended from sunday
const EventFromLastWeek = ({ index, event, eventTitle, date }) => {
  return eventExtendsOnMonday(event, date) ? (
    <EventPointingLeftAndRight
      {...{
        index,
        event,
        eventTitle,
        date,
      }}
    />
  ) : (
    <EventPointingLeft
      {...{
        index,
        event,
        eventTitle,
        date,
      }}
    />
  );
};

export default EventFromLastWeek;
