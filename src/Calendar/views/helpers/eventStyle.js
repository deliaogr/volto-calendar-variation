export const eventStyle = (event) => {
  if (!event) {
    return '';
  }
  // timed event
  if (event.startHour && event.endHour && event.startDate === event.endDate) {
    return 'task task--timed';
  }
  // past full day event
  else if (new Date(event.endDate) < new Date()) {
    return 'task task--past-full-day';
  }
  // active full day event
  return 'task task--active-full-day';
};
