// app.js
const postgres = require("postgres");
require("dotenv").config();

let { DB_NAME, DB_HOST, DB_USER, DB_PASSWORD, ENDPOINT_ID } = process.env;

const sql = postgres({
  host: DB_HOST,
  database: DB_NAME,
  username: DB_USER,
  password: DB_PASSWORD,
  port: 3002,
  ssl: "require",
  connection: {
    options: `project=${ENDPOINT_ID}`,
  },
});

async function getPgVersion() {
  const result = await sql`select version()`;
  console.log(result);
}

getPgVersion();
