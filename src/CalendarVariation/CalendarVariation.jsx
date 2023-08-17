import React, { useState, useEffect } from 'react';
import Calendar from '../Calendar/Calendar';
import { formatEventsForInterval } from '../Utils/RRuleConnector';
import { EditEventSchema, MoveRecEventSchema } from './schema';
import { ModalForm } from '@plone/volto/components';
import { injectIntl } from 'react-intl';
import { flattenToAppURL } from '@plone/volto/helpers';
import { useDispatch } from 'react-redux';
import { updateContent } from './actions';

const CalendarVariation = ({
  items,
  isEditMode,
  intl,
  initial_view,
  user_select_view,
  initial_date,
}) => {
  const dispatch = useDispatch();
  const [eventsInInterval, setEventsInInterval] = useState([]);
  const [interval, setInterval] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRecEventModalOpen, setIsRecEventModalOpen] = useState(false);
  const [formData, setFormData] = useState();

  useEffect(() => {
    let events = items.filter((item) => item['@type'] === 'Event');
    if (!interval) return;
    setEventsInInterval(formatEventsForInterval(events, interval));
  }, [items, interval]);

  const getCurrentEventById = (eventId) => {
    const event = items.find((item) => item.id === eventId);
    if (event) {
      setFormData({
        title: event.title,
        eventStarts: event.start,
        eventEnds: event.end,
        id: event.id,
        wholeDay: event.whole_day,
      });
    }

    return event;
  };

  const updateEvent = (eventData) => {
    const event = getCurrentEventById(eventData.id);
    if (!event) return;
    const path = flattenToAppURL(event['@id']);

    let eventStartDate = new Date(eventData.startDate).toISOString();
    let eventEndDate = new Date(eventData.endDate).toISOString();

    if (eventData.startHour && eventData.endHour) {
      const [startYear, startMonth, startDay] = eventData.startDate.split('-');
      const [startHour, startMinute] = eventData.startHour.split(':');
      const [endYear, endMonth, endDay] = eventData.endDate.split('-');
      const [endHour, endMinute] = eventData.endHour.split(':');

      const combinedStartDate = new Date(
        startYear,
        startMonth - 1,
        startDay,
        startHour,
        startMinute,
      ).toISOString();
      const combinedEndDate = new Date(
        endYear,
        endMonth - 1,
        endDay,
        endHour,
        endMinute,
      ).toISOString();

      eventStartDate = combinedStartDate;
      eventEndDate = combinedEndDate;
    }

    const dataToSend = {
      title: eventData.title,
      start: eventStartDate,
      end: eventEndDate,
      id: eventData.id,
    };

    dispatch(updateContent(path, {}, dataToSend));
  };

  const onSubmitEditEvent = (e) => {
    const event = getCurrentEventById(e.id);
    if (!event) return;

    const path = flattenToAppURL(event['@id']);

    const dataToSend = {
      title: e.title,
      start: e.startDate,
      end: e.endDate,
      id: e.id,
      whole_day: e.wholeDay,
    };

    dispatch(updateContent(path, {}, dataToSend));
  };

  const onSubmitMoveRecEvent = (updateOption) => {
    updateEvent(formData);
  };

  const handleOnCancel = () => {
    setIsModalOpen(false);
    setIsRecEventModalOpen(false);
  };

  const handleEdit = (eventId) => {
    getCurrentEventById(eventId);
    setIsModalOpen(true);
  };

  const handleDrop = (event) => {
    if (event.recursive !== 'no') {
      setIsRecEventModalOpen(true);
      setFormData(event);
    } else {
      updateEvent(event);
    }
  };

  return (
    <div>
      {isModalOpen && formData && isEditMode && (
        <ModalForm
          schema={EditEventSchema(intl)}
          onSubmit={onSubmitEditEvent}
          title={'Edit event'}
          open={isModalOpen}
          formData={formData}
          onCancel={handleOnCancel}
          key="JSON"
        />
      )}
      {isRecEventModalOpen && isEditMode && (
        <ModalForm
          schema={MoveRecEventSchema(intl)}
          onSubmit={onSubmitMoveRecEvent}
          title={'Only this event or all events in series?'}
          open={isRecEventModalOpen}
          onCancel={handleOnCancel}
          key="JSON"
        />
      )}
      <Calendar
        {...{
          handleEdit,
          handleDrop,
          setInterval,
          isEditMode,
          eventsInInterval,
          initial_view,
          user_select_view,
          initial_date,
          setIsRecEventModalOpen,
        }}
      />
    </div>
  );
};

export default injectIntl(CalendarVariation);
