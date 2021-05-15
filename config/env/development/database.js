module.exports = ({ env }) => ({
  defaultConnection: 'default',
  connections: {
    default: {
      connector: 'bookshelf',
      settings: {
        client: 'postgres',
        host: env('DATABASE_HOST', 'localhost'),
        port: env.int('DATABASE_PORT', 5432),
        database: env('DATABASE_NAME', 'strapi_db_development'),
        username: env('DATABASE_USERNAME', 'strapi_dbuser'),
        password: env('DATABASE_PASSWORD', 'password'),
        schema: env('DATABASE_SCHEMA', 'public'), // Not Required
      },
      options: {},
    },
  },
});
