var knex = require("../database/connection");
var bcrypt = require("bcrypt");

class User {
  async new(name, email, password) {
    try {
      var hash = await bcrypt.hash(password, 10);

      await knex
        .insert({ name, email, password: hash, role: 2 })
        .table("users");
    } catch (err) {
      console.log(err);
    }
  }

  async newAdmin(name, email, password) {
    try {
      var hash = await bcrypt.hash(password, 10);

      await knex
        .insert({ name, email, password: hash, role: 1 })
        .table("users");
    } catch (err) {
      console.log(err);
    }
  }

  async findEmail(email) {
    try {
      var result = await knex.select("*").from("users").where({ email: email });
      if (result.length > 0) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      console.log(err);
      return false;
    }
  }

  async findAll() {
    try {
      var result = await knex
        .select(["id", "name", "email", "role"])
        .table("users");

      if (result.length == 0) {
        return undefined;
      }

      return result;
    } catch (e) {
      console.log(e);
      return [];
    }
  }

  async findByEmail(email) {
    try {
      var result = await knex
        .select(["id", "name", "email", "role", "password"])
        .where({ email: email })
        .table("users");
      if (result.length == 0) {
        return undefined;
      } else {
        return result[0];
      }
    } catch (e) {
      console.log(e);
      return [];
    }
  }

  async findById(id) {
    try {
      var result = await knex
        .select(["id", "name", "email", "role"])
        .where({ id: id })
        .table("users");
      if (result.length == 0) {
        return undefined;
      }
      return result;
    } catch (e) {
      console.log(e);
      return undefined;
    }
  }

  async verifyEmail(email) {
    try {
      var result = await knex.select("*").from("users").where({ email: email });
      if (result.length > 0) {
        return result[0].email;
      } else {
        return false;
      }
    } catch (e) {
      console.log(err);
      return false;
    }
  }

  async update(id, email, name, role) {
    var user = await this.findById(id);

    if (user != undefined) {
      var editUser = {};
      if (email != user.email) {
        var emailExists = await this.verifyEmail(email);
        if (emailExists != email) {
          return {
            status: false,
            err: "Email already exists",
            email: emailExists,
          };
        } else {
          editUser.email = email;
        }
      }

      if (name != undefined) {
        editUser.name = name;
      }

      if (role != undefined) {
        editUser.role = role;
      }

      try {
        await knex.update(editUser).where({ id: id }).table("users");
        return { status: true };
      } catch (e) {
        console.log(e);
        return { status: false, err: e };
      }
    } else {
      return { status: false, err: "User not found" };
    }
  }

  async delete(id) {
    var user = await this.findById(id);

    if (user != undefined) {
      try {
        await knex.delete().where({ id: id }).table("users");
        return { status: true };
      } catch (err) {
        console.log(err);
        return { status: false, err: err };
      }
    } else {
      return { status: false, err: "User not found" };
    }
  }
}

module.exports = new User();

// {
// 	"title": "Avatar: O Caminho da Água",
// 	"original_title": "Avatar: The Way of Water",
// 	"cover_image": "https://cinearaujo.com.br/filmes/filme3232_f21.jpg",
// 	"link_trailer": "https://www.youtube.com/watch?v=fMdb0nGsICE",
// 	"release_year": 2022,
// 	"duration": "3h 01min",
// 	"cast": "Sam Worthington, Zoe Saldana, Sigourney Weaver",
// 	"awards": "",
// 	"director": "James Cameron",
// 	"rating":
// 		 "imdb: 9.8"
// 	,
// 	"synopsis": "Em Avatar: O Caminho da Água, sequência de Avatar (2009), após dez anos da primeira batalha de Pandora entre os Na'vi e os humanos, Jake Sully (Sam Worthington) vive pacificamente com sua família e sua tribo. Ele e Ney'tiri formaram uma família e estão fazendo de tudo para ficarem juntos, devido a problemas conjugais e papéis que cada um tem que exercer dentro da tribo. No entanto, eles devem sair de casa e explorar as regiões de Pandora, indo para o mar e fazendo pactos com outros Na'vi da região. Quando uma antiga ameaça ressurge, Jake deve travar uma guerra difícil contra os humanos novamente. Mesmo com dificuldade, Jake acaba fazendo novos aliados - alguns dos quais já vivem entre os Na'vi e outros com novos avatares. Mesmo com uma guerra em curso, Jake e Ney'tiri terão que fazer de tudo para ficarem juntos e cuidar da família e de sua tribo.",
// 	"category_ids": [
// 		1,2
// 	]
// }
