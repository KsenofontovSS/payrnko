export default ({ env }) => ({
  upload: {
    config: {
      provider: env('S3_ENDPOINT') ? '@strapi/provider-upload-aws-s3' : 'local',
      providerOptions: env('S3_ENDPOINT')
        ? {
            s3Options: {
              credentials: {
                accessKeyId: env('S3_ACCESS_KEY'),
                secretAccessKey: env('S3_SECRET_KEY'),
              },
              endpoint: env('S3_ENDPOINT'),
              region: 'ru-central1',
              forcePathStyle: true,
              params: {
                Bucket: env('S3_BUCKET'),
              },
            },
          }
        : {},
    },
  },
  i18n: {
    enabled: true,
    config: {
      defaultLocale: 'ru',
      locales: ['ru', 'en'],
    },
  },
});
