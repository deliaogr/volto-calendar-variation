import { defineMessages } from 'react-intl';

const EditEventSchema = (intl) => {
  return {
    required: ['title', 'eventStarts', 'eventEnds'],
    fieldsets: [
      {
        id: 'default',
        title: 'default',
        fields: [
          'title',
          'eventStarts',
          'eventEnds',
          'id',
          'recursive',
          'wholeDay',
        ],
      },
    ],
    properties: {
      title: {
        title: intl.formatMessage(messages.title),
      },
      eventStarts: {
        title: intl.formatMessage(messages.eventStarts),
        widget: 'datetime',
      },
      eventEnds: {
        title: intl.formatMessage(messages.eventEnds),
        widget: 'datetime',
      },
      id: {
        title: intl.formatMessage(messages.id),
      },
      recursive: {
        title: intl.formatMessage(messages.recursive),
      },
      wholeDay: {
        title: intl.formatMessage(messages.wholeDay),
        type: 'boolean',
      },
    },
  };
};

const messages = defineMessages({
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
  id: {
    id: 'Event ID',
    defaultMessage: 'Event ID',
  },
  recursive: {
    id: 'Recursive',
    defaultMessage: 'Recursive',
  },
  wholeDay: {
    id: 'Whole Day',
    defaultMessage: 'Whole Day',
  },
});

export default EditEventSchema;
