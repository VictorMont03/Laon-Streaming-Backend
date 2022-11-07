var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");
var User = require("../models/User");

var secret = "Da4gWZuvczirXDCrNOM2ZUGDQD4ftyam";

module.exports = async function (req, res, next) {
  const authToken = req.headers["authorization"];
  //   var { email, current_password } = req.body;

  var current_password = null;

  var email = req.body.email;
  current_password = req.body.current_password;

  if (authToken != undefined && current_password != null) {
    const bearer = authToken.split(" ");
    var token = bearer[1];

    var decoded = jwt.verify(token, secret);

    try {
      var user = await User.findByEmail(email);

      if (user != undefined) {
        var result = await bcrypt.compare(current_password, user.password);
        if (result) {
          next();
        } else {
          console.log(decoded);
          res.status(403);
          res.json({
            err: "You don't have permission to access this",
            decoded: decoded,
            c: current_password,
          });
          return;
        }
      }
    } catch (err) {
      console.log(err);
      res.status(403);
      res.json({ err: "Invalid authorization token" });
      return;
    }
  } else {
    res.status(403);
    res.json({ err: "Invalid authorization token or invalid password" });
    return;
  }
};
