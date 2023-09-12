import React, { useState, useEffect } from 'react';
import Calendar from '../Calendar/Calendar';
import {
  addExceptionDate,
  formatEventsForInterval,
  updateRecurrenceEnd,
  updateRecurrenceStart,
} from '../Utils/RRuleConnector';
import { EditEventSchema, MoveRecEventSchema } from './schema';
import { ModalForm } from '@plone/volto/components';
import { injectIntl } from 'react-intl';
import { flattenToAppURL, getParentUrl } from '@plone/volto/helpers';
// import { createContent, getContent } from '@plone/volto/actions';
import { useDispatch } from 'react-redux';
import { updateContent, createContent } from './actions';

const formatToVoltoEvent = (eventData) => {
  let eventStartDate = new Date(eventData.startDate).toISOString();
  let eventEndDate = new Date(eventData.endDate).toISOString();
  let whole_day = false;

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
  } else {
    whole_day = true;
  }
  return { eventStartDate, eventEndDate, whole_day };
};

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
        recurrence: event.recurrence,
      });
    }

    return event;
  };

  const updateEvent = (eventData) => {
    const event = getCurrentEventById(eventData.id);
    if (!event) return;
    const path = flattenToAppURL(event['@id']);

    const { eventStartDate, eventEndDate, whole_day } = formatToVoltoEvent(
      eventData,
    );

    const dataToSend = {
      title: eventData.title,
      start: eventStartDate,
      end: eventEndDate,
      id: eventData.id,
      whole_day: whole_day,
      exDate: eventData.exDate || null,
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

  const onSubmitMoveRecEvent = ({ updateOption }) => {
    const event = getCurrentEventById(formData.id);
    if (!event) return;
    if (updateOption === 'multipleEvents') {
      if (formData.recurrenceIndex === 0) {
        updateEvent(formData);
      } else {
        const path = flattenToAppURL(event['@id']);
        const newPath = getParentUrl(event['@id']);
        const exDate = formData.exDate;
        const updatedRecurrence = updateRecurrenceEnd(event, exDate);

        const { eventStartDate, eventEndDate, whole_day } = formatToVoltoEvent(
          formData,
        );
        const extra = Math.random().toString().slice(0, 5);

        const newEventData = {
          title: formData.title,
          start: eventStartDate,
          end: eventEndDate,
          id: formData.id + extra,
          whole_day: whole_day,
          recurrence: updateRecurrenceStart(event, formData.exDate),
        };

        dispatch(
          createContent(newPath, {}, { ...newEventData, '@type': 'Event' }),
        );
        dispatch(
          updateContent(path, {}, { ...event, recurrence: updatedRecurrence }),
        );
      }
    } else {
      const newPath = getParentUrl(event['@id']);
      const exDate = formData.exDate;

      const { eventStartDate, eventEndDate, whole_day } = formatToVoltoEvent(
        formData,
      );
      const updatedInitialEvent = addExceptionDate(event, exDate);
      const path = flattenToAppURL(updatedInitialEvent['@id']);

      const extra = Math.random().toString().slice(0, 5);

      const newEventData = {
        title: formData.title,
        start: eventStartDate,
        end: eventEndDate,
        id: formData.id + extra,
        whole_day: whole_day,
      };

      dispatch(
        createContent(newPath, {}, { ...newEventData, '@type': 'Event' }),
      );
      dispatch(updateContent(path, {}, updatedInitialEvent));
    }
  };

  const handleOnCancel = () => {
    setIsModalOpen(false);
    setIsRecEventModalOpen(false);
  };

  const handleEdit = (eventId) => {
    getCurrentEventById(eventId);
    setIsModalOpen(true);
  };

  const handleDrop = (event, sourceDay) => {
    if (event.recursive !== 'no') {
      setIsRecEventModalOpen(true);
      setFormData({
        ...event,
        exDate: new Date(
          sourceDay.year,
          sourceDay.month - 1,
          sourceDay.dayNumber,
        ),
      });
    } else {
      updateEvent(event);
    }
  };

  return (
    <>
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
    </>
  );
};

export default injectIntl(CalendarVariation);
