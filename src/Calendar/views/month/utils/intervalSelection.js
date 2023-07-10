import { MONTHS } from '../../../constants';
import { makeIntervalToFetchMonthEvents } from './makeIntervalToFetchMonthEvents';

const onChangeMonth = (
  monthSelection,
  year,
  setCurrentMonth,
  setIntervalForNewEvents,
) => {
  setCurrentMonth(monthSelection);
  setIntervalForNewEvents(
    makeIntervalToFetchMonthEvents(monthSelection, year, []),
  );
};

const selectInitialMonth = () => {
  return MONTHS[new Date().getMonth()];
};

const setNextYear = (selectedYear, setSelectedYear, setCurrentMonth) => {
  const year = selectedYear + 1;
  setSelectedYear(year);
  onChangeMonth(MONTHS[0], year, setCurrentMonth);
};

const setPreviousYear = (selectedYear, setSelectedYear, setCurrentMonth) => {
  const year = selectedYear - 1;
  setSelectedYear(year);
  onChangeMonth(MONTHS[11], year, setCurrentMonth);
};

const handlePreviousMonth = (
  selectedMonth,
  setCurrentMonth,
  setIntervalForNewEvents,
  selectedYear,
  setSelectedYear,
) => {
  selectedMonth.key > 0
    ? onChangeMonth(
        MONTHS[selectedMonth.key - 1],
        selectedYear,
        setCurrentMonth,
        setIntervalForNewEvents,
      )
    : setPreviousYear(selectedYear, setSelectedYear);
};

const handleNextMonth = (
  selectedMonth,
  setCurrentMonth,
  setIntervalForNewEvents,
  selectedYear,
  setSelectedYear,
) => {
  selectedMonth.key < 11
    ? onChangeMonth(
        MONTHS[selectedMonth.key + 1],
        selectedYear,
        setCurrentMonth,
        setIntervalForNewEvents,
      )
    : setNextYear(selectedYear, setSelectedYear);
};

const handleToday = (
  setCurrentMonth,
  setIntervalForNewEvents,
  setSelectedYear,
) => {
  setSelectedYear(new Date().getFullYear());
  const year = new Date().getFullYear();
  onChangeMonth(
    MONTHS[new Date().getMonth()],
    year,
    setCurrentMonth,
    setIntervalForNewEvents,
  );
};

const displayMonth = (selectedMonth, setSelectedMonth, selectedYear) => (
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
            onChangeMonth(MONTHS[month.key], selectedYear, setSelectedMonth)
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
