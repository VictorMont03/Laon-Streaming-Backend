var knex = require("../database/connection");

class Movie {
  async create(movie) {
    var {
      title,
      original_title,
      cover_image,
      link_trailer,
      release_year,
      duration,
      cast,
      awards,
      director,
      rating,
      category_ids,
      synopsis,
    } = movie;

    var slug = original_title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    await knex
      .insert({
        title,
        original_title,
        slug,
        cover_image,
        link_trailer,
        release_year,
        duration,
        cast,
        awards,
        director,
        rating,
        synopsis,
      })
      .table("movies");

    const created_movie = await this.getMovieBySlug(slug);
    const film_id = created_movie.movie.id;

    category_ids.map(async (category_id) => {
      try {
        await knex
          .insert({
            film_id,
            category_id,
          })
          .table("films_categories_relation");
      } catch (e) {
        console.log(e);
      }
    });
  }

  async listAll() {
    try {
      var result = await knex
        .select(["cover_image", "title", "original_title", "slug"])
        .table("movies");

      if (result.length == 0) {
        return undefined;
      }

      return result;
    } catch (e) {
      console.log(e);
      return undefined;
    }
  }

  async getMovieBySlug(slug) {
    try {
      var result = await knex.select("*").from("movies").where({ slug: slug });

      if (result.length > 0) {
        var categories = await knex
          .select(["films-categories.title as category_title"])
          .table("films_categories_relation")
          .innerJoin("movies", "movies.id", "films_categories_relation.film_id")
          .innerJoin(
            "films-categories",
            "films-categories.id",
            "films_categories_relation.category_id"
          )
          .where("movies.id", result[0].id);

        return { status: true, movie: result[0], categories: categories };
      } else {
        return { status: false, err: "Could not find the movie" };
      }
    } catch (e) {
      console.log(e);
      return { status: false, err: "Could not find the movie" };
    }
  }

  async getMoviesByCategory(category_id) {
    try {
      //   var result = await knex.select("*").from("movies").where({ slug: slug });

      var result = await knex
        .select([
          "films-categories.title as category_title",
          "movies.title as movies_title",
          "movies.cover_image",
          "movies.original_title",
          "movies.slug",
        ])
        .table("films_categories_relation")
        .innerJoin("movies", "movies.id", "films_categories_relation.film_id")
        .innerJoin(
          "films-categories",
          "films-categories.id",
          "films_categories_relation.category_id"
        )
        .where("films-categories.id", category_id);

      if (result.length > 0) {
        return { status: true, movies: result };
      } else {
        return { status: false, err: "Could not find the any movies" };
      }
    } catch (e) {
      console.log(e);
      return { status: false, err: "Could not find the any movies" };
    }
  }

  async getCategories() {
    try {
      var result = await knex
        .select(["id", "title", "slug"])
        .table("films-categories");

      if (result.length == 0) {
        return undefined;
      }

      return result;
    } catch (e) {
      console.log(e);
      return { status: false, err: "Could not find the any category" };
    }
  }
}

module.exports = new Movie();

// {
// 	"title": "Adão Negro",
// 	"original_title": "Black Adam",
// 	"cover_image": "https://cinearaujo.com.br/filmes/filme3225_cp.jpg",
// 	"link_trailer": "https://youtu.be/I3CpaqCK9B0",
// 	"release_year": 2022,
// 	"duration": "2h 06min",
// 	"cast": "Dwayne Johnson, Sarah Shahi, Viola Davis",
// 	"awards": "",
// 	"director": "Jaume Collet-Serra",
// 	"rating":
// 		 "8.9"
// 	,
// 	"synopsis": "Adão Negro é o filme solo do anti-herói, baseado no personagem em quadrinhos Black Adam (Dwayne Johnson) da DC Comics, grande antagonista de Shazam!, tendo no longa, sua história de origem explorada, e revelando seu passado de escravo no país Kahndaq. Nascido no Egito Antigo, o anti-herói tem super força, velocidade, resistência, capacidade de voar e de disparar raios. Alter ego de Teth-Adam e filho do faraó Ramsés II, Adão Negro foi consumido por poderes mágicos e transformado em um feiticeiro. Grande inimigo de Shazam! nas HQs, apesar dele acreditar em seu pontecial e, inclusive, oferecê-lo como um guerreiro do bem, Adão Negro acaba usando suas habilidades especiais para o mal. O anti-herói em busca de redenção ou um herói que se tornou vilão, pode ser capaz de destruir tudo o que estiver pela frente - ou de encontrar seu caminho."
// }
