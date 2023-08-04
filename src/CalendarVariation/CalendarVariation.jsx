import React, { useState, useEffect } from 'react';
import Calendar from '../Calendar/Calendar';
import { formatEventsForInterval } from '../Utils/RRuleConnector';
import EditEventSchema from './schema';
import { ModalForm } from '@plone/volto/components';
import { injectIntl } from 'react-intl';
import { flattenToAppURL } from '@plone/volto/helpers';
import { useDispatch, useSelector } from 'react-redux';
import { getRawContent, updateContent } from './actions';

const CalendarVariation = ({ items, isEditMode, intl }) => {
  const [eventsInInterval, setEventsInInterval] = useState([]);
  const [interval, setInterval] = useState();
  const [modalOpen, setIsModalOpen] = useState(false);

  let defaultEvent = {};

  useEffect(() => {
    let events = items.filter((item) => item['@type'] === 'Event');
    if (!interval) return;
    setEventsInInterval(formatEventsForInterval(events, interval));
  }, [items, interval]);

  const updateEvent = (eventData) => {
    // editEvent({
    //   title: eventData.title,
    //   startDate: eventData.startDate,
    //   endDate: eventData.endDate,
    //   id: eventData.id,
    //   startHour: eventData.startHour ? eventData.startHour : null,
    //   endHour: eventData.endHour ? eventData.endHour : null,
    //   recursive: eventData.recursive,
    // });
  };

  const getCurrentEventById = (eventId) => {
    return eventsInInterval[eventId];
  };

  const makeDefaultEvent = (interval) =>
    (defaultEvent = {
      ...interval,
      recursive: 'no',
    });

  const onSubmit = (e) => {
    const dataToSend = {
      title: e.title,
      start: e.eventStarts,
      end: e.eventEnds,
      recurrence: e.recursive,
      whole_day: e.wholeDay,
    };
    dispatch(updateContent(path, {}, dataToSend));
    setIsModalOpen(false);
    dispatch(getRawContent(path));
    // setCurrentItem(null);
  };

  const handleOnCancel = () => {
    setIsModalOpen(false);
  };

  const path = flattenToAppURL(items[0]?.['@id'] ? `${items[0]['@id']}` : null);

  const dispatch = useDispatch();
  const request = useSelector((state) => state.rawDataReducer?.[path]);
  const content = request?.data;

  const formData = content && {
    title: content.title,
    eventStarts: content.start,
    eventEnds: content.end,
    id: content.id,
    recursive: content.recurrence || 'no',
    wholeDay: content.whole_day,
  };

  useEffect(() => {
    if (path && !request?.loading && !request?.loaded && !content)
      dispatch(getRawContent(path));
  }, [dispatch, path, content, request]);

  return (
    <div>
      <button onClick={() => setIsModalOpen(true)}>Open Modal</button>
      {modalOpen && isEditMode && (
        <ModalForm
          schema={EditEventSchema(intl)}
          onSubmit={onSubmit}
          title={'Edit event'}
          open={modalOpen}
          formData={formData}
          onCancel={handleOnCancel}
          key="JSON"
        />
      )}
      <Calendar
        {...{
          // ModalPopUp,
          // handleOpenModal,
          setInterval,
          getCurrentEventById,
          makeDefaultEvent,
          updateEvent,
          isEditMode,
          eventsInInterval,
        }}
      />
    </div>
  );
};

export default injectIntl(CalendarVariation);
