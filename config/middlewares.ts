import type { Core } from '@strapi/strapi';

const config: Core.Config.Middlewares = [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  {
    name: 'strapi::body',
    config: {
      patchKoa: true,
      includeUnparsed: true, // This is key
      formLimit: '56kb',
      jsonLimit: '1mb',
      textLimit: '1mb',
      formidable: {
        maxFileSize: 200 * 1024 * 1024,
      },
    },
  },
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];

export default config;