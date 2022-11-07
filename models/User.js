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
