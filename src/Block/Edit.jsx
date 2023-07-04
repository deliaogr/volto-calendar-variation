import React from 'react';
import CalendarView from './View';
import schema from './schema';

const CalendarEdit = (props) => {
  // React.useEffect(() => {
  //   const defaultValues = {};
  //   Object.keys(schema.properties).forEach((key) => {
  //     if (schema.properties[key].hasOwnProperty('default')) {
  //       defaultValues[key] = schema.properties[key].default;
  //     }
  //   });
  //   props.onChangeBlock(props.block, {
  //     ...defaultValues,
  //     ...props.data,
  //   });
  // }, []);
  // console.log({props})
  return (
    <div>
      <CalendarView {...props} />
    </div>
  );
};

export default CalendarEdit;
