import { defineMessages } from 'react-intl';

const EditEventSchema = (intl) => {
  return {
    required: ['title', 'eventStarts', 'eventEnds'],
    fieldsets: [
      {
        id: 'default',
        title: 'default',
        fields: ['title', 'eventStarts', 'eventEnds', 'wholeDay'],
      },
    ],
    properties: {
      title: {
        title: intl.formatMessage(editEventMessages.title),
      },
      eventStarts: {
        title: intl.formatMessage(editEventMessages.eventStarts),
        widget: 'datetime',
      },
      eventEnds: {
        title: intl.formatMessage(editEventMessages.eventEnds),
        widget: 'datetime',
      },
      wholeDay: {
        title: intl.formatMessage(editEventMessages.wholeDay),
        type: 'boolean',
      },
    },
  };
};

const editEventMessages = defineMessages({
  title: {
    id: 'Event Title',
    defaultMessage: 'Title',
  },
  eventStarts: {
    id: 'Event Starts',
    defaultMessage: 'Event Starts',
  },
  eventEnds: {
    id: 'Event Ends',
    defaultMessage: 'Event Ends',
  },
  wholeDay: {
    id: 'Whole Day',
    defaultMessage: 'Whole Day',
  },
});

const getMoveEventChoices = (intl) => {
  return [
    ['oneEvent', intl.formatMessage(moveEventMessages.labelSingleEvent)],
    ['multipleEvents', intl.formatMessage(moveEventMessages.labelNextEvents)],
  ];
};

const MoveRecEventSchema = (intl) => {
  const moveChoices = getMoveEventChoices(intl);

  return {
    required: ['moveEvent'],
    fieldsets: [
      {
        id: 'default',
        title: 'default',
        fields: ['moveEvent'],
      },
    ],
    properties: {
      moveEvent: {
        title: intl.formatMessage(moveEventMessages.labelMoveEvent),
        choices: moveChoices,
        noValueOption: false,
      },
    },
  };
};

const moveEventMessages = defineMessages({
  labelMoveEvent: {
    id: 'Move event',
    defaultMessage: 'Move event',
  },
  labelSingleEvent: {
    id: 'Only this event',
    defaultMessage: 'Only this event',
  },
  labelNextEvents: {
    id: 'This and next events in series',
    defaultMessage: 'This and next events in series',
  },
});

export { EditEventSchema, MoveRecEventSchema };
