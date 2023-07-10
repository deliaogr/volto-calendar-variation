import { MONTHS } from '../../../constants';
import { firstAndLastDayOfTheWeek } from '../utils/firstAndLastDayOfTheWeek';
import { makeInterval } from './makeInterval';

const onChangeWeek = (
  firstDay,
  lastDay,
  setSelectedWeek,
  setIntervalForNewEvents,
) => {
  setSelectedWeek(firstAndLastDayOfTheWeek(firstDay));
  setIntervalForNewEvents(
    makeInterval(
      new Date(firstDay).getFullYear(),
      new Date(firstDay).getMonth(),
      new Date(firstDay).getDate(),
      new Date(lastDay).getFullYear(),
      new Date(lastDay).getMonth(),
      new Date(lastDay).getDate(),
    ),
  );
};

const selectInitialWeek = () => {
  return firstAndLastDayOfTheWeek(new Date());
};

let firstDay, lastDay;

const calculateFirstDay = (selectedWeek) => {
  return new Date(
    `${selectedWeek.startYear}/${selectedWeek.startMonth}/${selectedWeek.startDay}`,
  );
};

const calculateLastDay = (selectedWeek) => {
  return new Date(
    `${selectedWeek.endYear}/${selectedWeek.endMonth}/${selectedWeek.endDay}`,
  );
};

const handlePreviousWeek = (
  selectedWeek,
  setSelectedWeek,
  setIntervalForNewEvents,
) => {
  firstDay = calculateFirstDay(selectedWeek);
  lastDay = calculateLastDay(selectedWeek);

  firstDay = new Date(
    firstDay.setDate(calculateFirstDay(selectedWeek).getDate() - 7),
  );
  lastDay = new Date(lastDay.setDate(lastDay.getDate() - 7));
  onChangeWeek(firstDay, lastDay, setSelectedWeek, setIntervalForNewEvents);
};

const handleNextWeek = (
  selectedWeek,
  setSelectedWeek,
  setIntervalForNewEvents,
) => {
  firstDay = calculateFirstDay(selectedWeek);
  lastDay = calculateLastDay(selectedWeek);

  firstDay = new Date(
    firstDay.setDate(calculateFirstDay(selectedWeek).getDate() + 7),
  );
  lastDay = new Date(lastDay.setDate(lastDay.getDate() + 7));
  onChangeWeek(firstDay, lastDay, setSelectedWeek, setIntervalForNewEvents);
};

const handleToday = (setSelectedWeek, setIntervalForNewEvents) => {
  const today = firstAndLastDayOfTheWeek(new Date());
  firstDay = calculateFirstDay(today);
  lastDay = calculateLastDay(today);
  onChangeWeek(firstDay, lastDay, setSelectedWeek, setIntervalForNewEvents);
};

const displayWeeks = (selectedWeek) => {
  const result =
    selectedWeek.startMonth === selectedWeek.endMonth
      ? `${MONTHS[selectedWeek.startMonth - 1]?.text} ${selectedWeek.startYear}`
      : `${MONTHS[selectedWeek.startMonth - 1]?.text.slice(0, 3)} ${
          selectedWeek.startYear
        } - ${MONTHS[selectedWeek.endMonth - 1]?.text.slice(0, 3)} ${
          selectedWeek.endYear
        }`;
  return (
    <div className="dropdown">
      <button className="dropbtn">{result}</button>
    </div>
  );
};

export const Week = {
  handleChangePrevious: handlePreviousWeek,
  handleChangeNext: handleNextWeek,
  handleToday,
  selectInitialPeriod: selectInitialWeek,
  displayPeriod: displayWeeks,
};
