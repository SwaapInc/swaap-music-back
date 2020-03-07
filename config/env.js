const env = {
    database: 'postgres',
    username: 'postgres',
    password: '',
    host: 'localhost',
    dialect: 'postgres',
    port: 5432,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };
  module.exports = env;