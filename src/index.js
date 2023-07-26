import calendarSVG from '@plone/volto/icons/calendar.svg';
import { CalendarVariation } from './CalendarVariation';
import CalendarView from './Block/View';
import CalendarEdit from './Block/Edit';
import CalendarBlockSchema from './Block/schema';

const applyConfig = (config) => {
  config.blocks.blocksConfig.calendar = {
    id: 'calendar',
    title: 'Calendar',
    icon: calendarSVG,
    group: 'common',
    view: CalendarView,
    edit: CalendarEdit,
    restricted: false,
    mostUsed: false,
    blockHasOwnFocusManagement: false,
    sidebarTab: 1,
    security: {
      addPermission: [],
      view: [],
    },
  };

  config.blocks.blocksConfig.listing.variations = [
    ...config.blocks.blocksConfig.listing.variations,
    {
      id: 'calendar',
      isDefault: false,
      fullobjects: true,
      title: 'Calendar',
      template: CalendarVariation,
      /* use schemaEnhancer to add fields of CalendarBlock here */
      schemaEnhancer: ({ schema, formData, intl }) => {
        const blockSchema = CalendarBlockSchema(intl);
        Object.keys(blockSchema.properties).forEach((key) => {
          if (key !== 'calendar_url') {
            schema.properties[key] = blockSchema.properties[key];
            schema.fieldsets[0].fields.push(key);
          }
        });
        return schema;
      },
    },
  ];
  return config;
};

export default applyConfig;
