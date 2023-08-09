import { displayDay } from './displayDay';

export const displayDayNumbers = (day, dayIndex, provided) => {
  return (
    <div key={`key-div-${dayIndex}`}>
      {displayDay(day)}
      {provided.placeholder}
    </div>
  );
};
