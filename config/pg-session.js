const pg = require("pg");

require("dotenv").config();

const pgPool = new pg.Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST || "localhost",
  database: process.env.POSTGRES_DATABASE_NAME,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
  ssl: true,
});

module.exports = pgPool;