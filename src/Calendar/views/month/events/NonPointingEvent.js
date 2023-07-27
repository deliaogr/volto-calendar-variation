import { eventStyle } from '../../helpers';

const NonPointingEvent = ({
  index,
  eventDayIndex,
  makeEventWidth,
  displayEvents,
}) => {
  return (
    <div
      key={`key-div-${index}`}
      className={eventStyle(eventDayIndex)}
      style={{
        width: `${makeEventWidth(eventDayIndex)}%`,
      }}
    >
      {displayEvents(eventDayIndex)}
    </div>
  );
};

export default NonPointingEvent;
