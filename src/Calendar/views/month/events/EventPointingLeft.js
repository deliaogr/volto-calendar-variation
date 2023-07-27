import { eventStyle } from '../../helpers';

const EventPointingLeft = ({ index, eventDayIndex, makeEventWidth }) => {
  const isEventActiveLeft = (event) => {
    return new Date(event?.endDate).getTime() > new Date().getTime()
      ? 'triangle-left-active'
      : 'triangle-left-past';
  };

  return (
    <div
      className="line-up"
      style={{
        width: `${makeEventWidth(eventDayIndex)}%`,
      }}
      key={`key-div-${index}`}
    >
      <div className={isEventActiveLeft(eventDayIndex)}></div>
      <section
        className={eventStyle(eventDayIndex)}
        style={{
          width: `${makeEventWidth(eventDayIndex)}%`,
          borderTopLeftRadius: '0px',
          borderBottomLeftRadius: '0px',
        }}
      >
        {eventDayIndex?.title}
      </section>
    </div>
  );
};

export default EventPointingLeft;
