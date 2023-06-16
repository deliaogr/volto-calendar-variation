import { CalendarListing } from './components';
import CalendarBlockSchema from './components/manage/Blocks/Listing/schema';

const applyConfig = (config) => {
  config.blocks.blocksConfig.listing.variations = [
    ...config.blocks.blocksConfig.listing.variations,
    {
      id: 'calendar',
      isDefault: false,
      title: 'Calendar',
      template: CalendarListing,
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
