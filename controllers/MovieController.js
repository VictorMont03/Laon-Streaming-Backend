var Movie = require("../models/Movie");

class MovieController {
  async create(req, res) {
    const movie = req.body;
    try {
      await Movie.create(movie);
      res.status(200);
      res.json({ message: "Movie created successfully" });
    } catch (err) {
      console.log(err);
      res.status(500);
      res.json({ message: err.message });
    }
  }

  async delete(req, res) {
    res.send("delete movie");
  }

  async getMoviesByCategory(req, res) {
    const cateogry_id = req.params.id;

    try {
      var result = await Movie.getMoviesByCategory(cateogry_id);

      if (result.status) {
        res.status(200);
        res.json(result.movies);
        return;
      } else {
        res.status(404);
        res.json({ message: "No movies found", cateogry_id: cateogry_id });
        return;
      }
    } catch (err) {
      console.log(err);
      res.status(500);
      res.json({ message: err.message });
    }
  }

  async getMovieBySlug(req, res) {
    const slug = req.params.slug;
    try {
      var result = await Movie.getMovieBySlug(slug);

      if (result.status) {
        res.status(200);
        res.json({ movie_data: result.movie, categories: result.categories });
        return;
      } else {
        res.status(404);
        res.json({ message: "Movie not found" });
        return;
      }
    } catch (err) {
      console.log(err);
      res.status(500);
      res.json({ message: err.message });
    }
  }

  async getAllMovies(req, res) {
    try {
      var movies = await Movie.listAll();
      res.status(200);
      res.json(movies);
    } catch (err) {
      console.log(err);
      res.status(500);
      res.json({ message: err.message });
    }
  }

  async getMovieCategories(req, res) {
    try {
      var categories = await Movie.getCategories();
      res.status(200);
      res.json(categories);
    } catch (err) {
      console.log(err);
      res.status(500);
      res.json({ message: err.message });
    }
  }
}

module.exports = new MovieController();
