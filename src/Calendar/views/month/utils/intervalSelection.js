import { MONTHS } from '../../../constants';
import { makeInterval } from './makeInterval';

const onChangeMonth = (monthSelection, year, setCurrentMonth, setInterval) => {
  setCurrentMonth(monthSelection);
  setInterval(makeInterval(monthSelection, year, []));
};

const selectInitialMonth = () => {
  return MONTHS[new Date().getMonth()];
};

const setNextYear = (
  selectedYear,
  setSelectedYear,
  setCurrentMonth,
  setInterval,
) => {
  const year = selectedYear + 1;
  setSelectedYear(year);
  onChangeMonth(MONTHS[0], year, setCurrentMonth, setInterval);
};

const setPreviousYear = (
  selectedYear,
  setSelectedYear,
  setCurrentMonth,
  setInterval,
) => {
  const year = selectedYear - 1;
  setSelectedYear(year);
  onChangeMonth(MONTHS[11], year, setCurrentMonth, setInterval);
};

const handlePreviousMonth = (
  selectedMonth,
  setCurrentMonth,
  setInterval,
  selectedYear,
  setSelectedYear,
) => {
  selectedMonth.key > 0
    ? onChangeMonth(
        MONTHS[selectedMonth.key - 1],
        selectedYear,
        setCurrentMonth,
        setInterval,
      )
    : setPreviousYear(
        selectedYear,
        setSelectedYear,
        setCurrentMonth,
        setInterval,
      );
};

const handleNextMonth = (
  selectedMonth,
  setCurrentMonth,
  setInterval,
  selectedYear,
  setSelectedYear,
) => {
  selectedMonth.key < 11
    ? onChangeMonth(
        MONTHS[selectedMonth.key + 1],
        selectedYear,
        setCurrentMonth,
        setInterval,
      )
    : setNextYear(selectedYear, setSelectedYear, setCurrentMonth, setInterval);
};

const handleToday = (setCurrentMonth, setInterval, setSelectedYear) => {
  setSelectedYear(new Date().getFullYear());
  const year = new Date().getFullYear();
  onChangeMonth(
    MONTHS[new Date().getMonth()],
    year,
    setCurrentMonth,
    setInterval,
  );
};

const displayMonth = (
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setInterval,
) => (
  <div className="dropdown">
    <button className="dropbtn">
      {selectedMonth?.text} {selectedYear}
    </button>
    <div className="dropdown-content">
      {MONTHS.map((month, index) => (
        // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events
        <p
          key={`key-${index}`}
          onClick={() =>
            onChangeMonth(
              MONTHS[month.key],
              selectedYear,
              setSelectedMonth,
              setInterval,
            )
          }
          className="dropdown-content-btn"
        >
          {month.text} {selectedYear}
        </p>
      ))}
    </div>
  </div>
);

export const Month = {
  handleChangePrevious: handlePreviousMonth,
  handleChangeNext: handleNextMonth,
  handleToday,
  selectInitialPeriod: selectInitialMonth,
  displayPeriod: displayMonth,
};
