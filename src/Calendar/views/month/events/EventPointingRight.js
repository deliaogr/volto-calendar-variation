import { eventStyle } from '../../helpers';

const EventPointingRight = ({
  index,
  eventDayIndex,
  makeEventWidth,
  displayEvents,
}) => {
  const isEventActiveRight = (event) => {
    return new Date(event?.endDate).getTime() > new Date().getTime()
      ? 'triangle-right-active'
      : 'triangle-right-past';
  };

  return (
    <div
      key={`key-div-${index}`}
      className="line-up"
      style={{
        width: `${makeEventWidth(eventDayIndex)}%`,
      }}
    >
      <div
        className={eventStyle(eventDayIndex)}
        style={{
          width: `${makeEventWidth(eventDayIndex)}%`,
          borderTopRightRadius: '0px',
          borderBottomRightRadius: '0px',
        }}
      >
        {displayEvents(eventDayIndex)}
      </div>
      <div className={isEventActiveRight(eventDayIndex)}></div>
    </div>
  );
};

export default EventPointingRight;
