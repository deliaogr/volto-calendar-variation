import messages from './messages';

const getViewChoices = (intl) => {
  return [
    ['Month', intl.formatMessage(messages.labelMonthTable)],
    ['Week', intl.formatMessage(messages.labelWeekTable)],
  ];
};

const CalendarBlockSchema = (intl) => {
  const viewChoices = getViewChoices(intl);

  return {
    title: intl.formatMessage(messages.labelCalendarSettings),

    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: [
          'calendar_url',
          'initial_view',
          'initial_date',
          'user_select_view',
        ],
      },
    ],

    properties: {
      calendar_url: {
        title: intl.formatMessage(messages.labelCalendarURL),
        description: intl.formatMessage(messages.descriptionCalendarURL),
        type: 'string',
      },
      user_select_view: {
        title: intl.formatMessage(messages.labelUserSelectView),
        type: 'boolean',
        default: 'false',
      },
      initial_view: {
        title: intl.formatMessage(messages.labelInitialView),
        type: 'string',
        factory: 'Choice',
        choices: viewChoices,
        isMulti: false,
        default: 'Month',
      },
      initial_date: {
        title: intl.formatMessage(messages.labelInitialDate),
        description: intl.formatMessage(messages.descriptionInitialDate),
        type: 'datetime',
        dateOnly: true,
      },
    },

    required: [],
  };
};

export default CalendarBlockSchema;
