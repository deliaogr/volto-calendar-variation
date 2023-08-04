import { eventStyle, makeEventWidth } from '../helpers';

const EventPointingLeft = ({ index, event, eventTitle, date }) => {
  const isEventActiveLeft = (event) => {
    return new Date(event?.endDate).getTime() > new Date().getTime()
      ? 'triangle-left-active'
      : 'triangle-left-past';
  };

  return (
    <div
      key={`key-div-${index}`}
      className="line-up"
      style={{
        width: `${makeEventWidth(event, date)}%`,
      }}
    >
      <div className={isEventActiveLeft(event)}></div>
      <section
        className={eventStyle(event)}
        style={{
          width: `${makeEventWidth(event, date)}%`,
          borderTopLeftRadius: '0px',
          borderBottomLeftRadius: '0px',
        }}
      >
        {eventTitle(event)}
      </section>
    </div>
  );
};

export default EventPointingLeft;
