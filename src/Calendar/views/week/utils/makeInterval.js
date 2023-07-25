import moment from 'moment';

export const makeInterval = (
  startYear,
  startMonth,
  startDay,
  endYear,
  endMonth,
  endDay,
) => {
  return {
    startMonth,
    endMonth,
    startDate: moment([startYear, startMonth, startDay]),
    endDate: moment([endYear, endMonth, endDay]),
  };
};
