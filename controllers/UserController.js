var User = require("../models/User");
var jwt = require("jsonwebtoken");

var bcrypt = require("bcrypt");

var secret = "Da4gWZuvczirXDCrNOM2ZUGDQD4ftyam";

class UserController {
  async create(req, res) {
    //Email validation
    var { email, name, password } = req.body;

    if (email == undefined) {
      res.status(400);
      res.json({ err: "Invalid email" });
      return;
    }

    var emailExists = await User.findEmail(email);

    if (emailExists) {
      res.status(406);
      res.json({ err: "Existing email" });
      return;
    }

    await User.new(name, email, password);

    res.status(200);
    res.send("User created");
  }

  async createAdmin(req, res) {
    //Email validation
    var { email, name, password } = req.body;

    if (email == undefined) {
      res.status(400);
      res.json({ err: "Invalid email" });
      return;
    }

    var emailExists = await User.findEmail(email);

    if (emailExists) {
      res.status(406);
      res.json({ err: "Existing email" });
      return;
    }

    await User.newAdmin(name, email, password);

    res.status(200);
    res.send({ message: "Admin user created" });
  }

  async findAll(req, res) {
    var users = await User.findAll();

    if (users == undefined) {
      res.status(404);
      res.json({ message: "No registered users" });
      return;
    }

    res.status(200);
    res.json(users);
    return;
  }

  async findUser(req, res) {
    var email = req.params.email;
    var user = await User.findByEmail(email);

    if (user == undefined) {
      res.status(404);
      res.json({ message: "User not found" });
      return;
    }
    res.status(200);
    res.json(user);
    return;
  }

  async edit(req, res) {
    var { id, email, name, role } = req.body;

    var result = await User.update(id, email, name, role);

    if (result.status) {
      res.json({ message: "User updated" });
      return;
    } else {
      res.status(406);
      res.send(result);
      return;
    }
  }

  async deleted(req, res) {
    var id = req.params.id;

    var result = await User.delete(id);

    if (result.status) {
      res.json({ message: "User deleted" });
      return;
    } else {
      res.status(404);
      res.json({ message: "A error has occurred" });
    }
  }

  async login(req, res) {
    var { email, password } = req.body;

    try {
      var user = await User.findByEmail(email);

      if (user != undefined) {
        var result = await bcrypt.compare(password, user.password);

        if (result) {
          var token = jwt.sign({ email: user.email, role: user.role }, secret);

          res.status(200);
          res.json({
            token: token,
            email: user.email,
            name: user.name,
            role: user.role,
          });
          return;
        } else {
          res.status(400);
          res.json({ message: "Password incorrect" });
          return;
        }
      }
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = new UserController();
