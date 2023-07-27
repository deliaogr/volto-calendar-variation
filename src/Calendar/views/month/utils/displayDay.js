export const displayDay = (day) => {
  return day.year === new Date().getFullYear() &&
    day.month === new Date().getMonth() + 1 &&
    day.dayNumber === new Date().getDate() ? (
    <div
      style={{
        width: '18px',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        textAlign: 'center',
        color: 'white',
        borderRadius: '50%',
        fontWeight: '500',
        marginBottom: '2px',
      }}
    >
      {day.dayNumber}
    </div>
  ) : (
    <div
      style={{
        marginBottom: '2px',
      }}
    >
      {day.dayNumber}
    </div>
  );
};
