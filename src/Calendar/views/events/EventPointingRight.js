import { eventStyle, makeEventWidth } from '../helpers';

const EventPointingRight = ({ index, event, eventTitle, date }) => {
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
        width: `${makeEventWidth(event, date)}%`,
      }}
    >
      <div
        className={eventStyle(event)}
        style={{
          width: `${makeEventWidth(event, date)}%`,
          borderTopRightRadius: '0px',
          borderBottomRightRadius: '0px',
        }}
      >
        {eventTitle(event)}
      </div>
      <div className={isEventActiveRight(event)}></div>
    </div>
  );
};

export default EventPointingRight;
