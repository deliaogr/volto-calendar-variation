import React, { useState } from 'react';
import ViewSelector from '../ViewSelector/ViewSelector';
import * as intervalSelectors from './intervalSelectors';

export const withViewSelector = (WrappedComponent) => {
  return (props) => {
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const {
      selectedView,
      setSelectedView,
      viewNames,
      setIntervalForNewEvents,
    } = props;

    const {
      handleChangeNext,
      handleChangePrevious,
      handleToday,
      selectInitialPeriod,
      displayPeriod,
    } = intervalSelectors[selectedView];

    const [selectedPeriod, setSelectedPeriod] = useState(selectInitialPeriod());

    return (
      <>
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
        <WrappedComponent {...{ selectedYear, selectedPeriod, ...props }} />
      </>
    );
  };
};
