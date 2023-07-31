import { displayDay } from './displayDay';

export const displayDayNumbers = (day, dayIndex, provided) => {
  return (
    <div
      key={`key-div-${dayIndex}`}
      onClick={() => {
        handleCreate(day.year, day.month - 1, day.dayNumber);
      }}
    >
      {displayDay(day)}
      {provided.placeholder}
    </div>
  );
};
