import { eventStyle, makeEventWidth } from '../helpers';

const NonPointingEvent = ({ index, event, eventTitle, date }) => {
  return (
    <div
      key={`key-div-${index}`}
      className={eventStyle(event)}
      style={{
        width: `${makeEventWidth(event, date)}%`,
      }}
    >
      {eventTitle(event)}
    </div>
  );
};

export default NonPointingEvent;
