var knex = require("knex")({
  client: "mysql2",
  connection: {
    host: "localhost",
    user: "root",
    password: "ademesmo",
    database: "laon",
  },
});

module.exports = knex;
