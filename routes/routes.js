var express = require("express");
var app = express();
var router = express.Router();
var HomeController = require("../controllers/HomeController");
var UserController = require("../controllers/UserController");
var MovieController = require("../controllers/MovieController");

//Middleware
var AdminAuth = require("../middleware/AdminAuth");
var ClientUpdateAuth = require("../middleware/ClientUpdateAuth");

router.get("/", HomeController.index);

//User Context
router.post("/user", UserController.create);
router.post("/admin/user", AdminAuth, UserController.createAdmin);
router.get("/user", AdminAuth, UserController.findAll);
router.get("/user/:email", AdminAuth, UserController.findUser);
router.put("/user", ClientUpdateAuth, UserController.edit);
router.delete("/user/:id", AdminAuth, UserController.deleted);

//Login context
router.post("/login", UserController.login);

//Movies Context
router.post("/movie", MovieController.create);
router.put("/movie", MovieController.delete);
router.get("/:id/movie", MovieController.getMoviesByCategory);
router.get("/movie/:slug", MovieController.getMovieBySlug);
router.get("/movie", MovieController.getAllMovies);
router.get("/movie-categories", MovieController.getMovieCategories);

module.exports = router;
