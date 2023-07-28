import { eventStyle } from '../../helpers';

const NonPointingEvent = ({
  index,
  eventDayIndex,
  makeEventWidth,
  eventTitle,
}) => {
  return (
    <div
      key={`key-div-${index}`}
      className={eventStyle(eventDayIndex)}
      style={{
        width: `${makeEventWidth(eventDayIndex)}%`,
      }}
    >
      {eventTitle(eventDayIndex)}
    </div>
  );
};

export default NonPointingEvent;
