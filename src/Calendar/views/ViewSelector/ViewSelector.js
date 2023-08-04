import React from 'react';

const ViewSelector = ({
  selectedView,
  viewNames,
  setSelectedView,
  handleChangePrevious,
  handleChangeNext,
  handleToday,
  selectedPeriod,
  selectedYear,
  setSelectedYear,
  setSelectedPeriod,
  displayPeriod,
  setInterval,
}) => {
  const viewSelect = (
    <div className="dropdown">
      <button className="dropdown-view-btn">{selectedView}</button>
      <div className="dropdown-view-content">
        {viewNames.map((view, index) => (
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
          <p
            key={`key-${index}`}
            onClick={() => setSelectedView(view)}
            className="dropdown-content-btn"
          >
            {view}
          </p>
        ))}
      </div>
    </div>
  );

  return (
    <div className="calendar-header">
      <button
        className="calendar-header-arrow-btn"
        onClick={() =>
          handleChangePrevious(
            selectedPeriod,
            setSelectedPeriod,
            setInterval,
            selectedYear,
            setSelectedYear,
          )
        }
      >
        <img src="https://i.imgur.com/2gqThFI.png" alt="left-arrow" />
      </button>
      {displayPeriod(
        selectedPeriod,
        setSelectedPeriod,
        selectedYear,
        setInterval,
      )}
      <button
        className="calendar-header-arrow-btn"
        onClick={() =>
          handleChangeNext(
            selectedPeriod,
            setSelectedPeriod,
            setInterval,
            selectedYear,
            setSelectedYear,
          )
        }
      >
        <img src="https://i.imgur.com/uambqYY.png" alt="right-arrow" />
      </button>
      <button
        onClick={() =>
          handleToday(setSelectedPeriod, setInterval, setSelectedYear)
        }
        className="calendar-header-today-btn"
      >
        Today
      </button>
      {viewSelect}
    </div>
  );
};

export default ViewSelector;
