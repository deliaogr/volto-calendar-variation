import React, { useState, useEffect } from 'react';
import './coursesCalendar.css';
import * as views from './views';
import { INITIAL_VIEW } from './constants';
import ViewSelector from './views/ViewSelector/ViewSelector';
import * as intervalSelectors from './views/ViewSelector/intervalSelectors';

const viewNames = Object.keys(views);

const Calendar = ({
  // ModalPopUp,
  // handleOpenModal,
  setIntervalForNewEvents,
  getCurrentEventById,
  makeDefaultEvent,
  updateEvent,
  isEditMode,
  allEventsInInterval: allEvents,
}) => {
  const [selectedView, setSelectedView] = useState(INITIAL_VIEW);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const View = views[selectedView];
  const {
    handleChangeNext,
    handleChangePrevious,
    handleToday,
    selectInitialPeriod,
    displayPeriod,
  } = intervalSelectors[selectedView];

  const [selectedPeriod, setSelectedPeriod] = useState(selectInitialPeriod());
  useEffect(() => setSelectedPeriod(selectInitialPeriod()), [
    selectInitialPeriod,
  ]);

  const handleEdit = (eventId) => {
    getCurrentEventById(eventId);
    // handleOpenModal();
  };

  return (
    <div>
      <div className="calendar-container">
        <ViewSelector
          {...{
            selectedView: 'Month',
            viewNames,
            setSelectedView,
            selectedYear,
            setSelectedYear,
            selectedPeriod,
            setSelectedPeriod,
            handleChangePrevious,
            handleChangeNext,
            handleToday,
            selectInitialPeriod,
            displayPeriod,
            setIntervalForNewEvents,
          }}
        />
        <View
          {...{
            selectedView,
            viewNames,
            setSelectedView,
            // ModalPopUp,
            handleEdit,
            allEvents,
            setIntervalForNewEvents,
            updateEvent,
            // handleOpenModal,
            makeDefaultEvent,
            isEditMode,
            selectedYear,
            selectedPeriod,
          }}
        />
      </div>
    </div>
  );
};

export default Calendar;
