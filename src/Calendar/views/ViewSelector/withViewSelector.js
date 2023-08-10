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
      setInterval,
      user_select_view,
      initial_date,
    } = props;

    const {
      handleChangeNext,
      handleChangePrevious,
      handleToday,
      selectInitialPeriod,
      displayPeriod,
    } = intervalSelectors[selectedView];

    const [selectedPeriod, setSelectedPeriod] = useState(
      selectInitialPeriod(initial_date),
    );

    return (
      <>
        <ViewSelector
          {...{
            selectedView,
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
            setInterval,
            user_select_view,
          }}
        />
        <WrappedComponent {...{ selectedYear, selectedPeriod, ...props }} />
      </>
    );
  };
};
