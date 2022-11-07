var bodyParser = require("body-parser");
var express = require("express");
var cors = require("cors");
var app = express();
var router = require("./routes/routes");
var database = require("./database/connection");

app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// database
//   .select([
//     "films-categories.title as category_title",
//     "movies.title as movies_title",
//   ])
//   .table("films_categories_relation")
//   .innerJoin("movies", "movies.id", "films_categories_relation.film_id")
//   .innerJoin(
//     "films-categories",
//     "films-categories.id",
//     "films_categories_relation.category_id"
//   )
//   .where("films-categories.id", 1)
//   .then((data) => {
//     console.log(data);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

app.use("/", router);

app.listen(8686, () => {
  console.log("Server on fire!");
});
