var jwt = require("jsonwebtoken");

var secret = "Da4gWZuvczirXDCrNOM2ZUGDQD4ftyam";

module.exports = function (req, res, next) {
  const authToken = req.headers["authorization"];

  if (authToken != undefined) {
    const bearer = authToken.split(" ");
    var token = bearer[1];

    try {
      var decoded = jwt.verify(token, secret);

      if (decoded.role == 1) {
        next();
      } else {
        console.log(decoded);
        res.status(403);
        res.json({
          err: "You don't have permission to access this",
          decoded: decoded,
        });
        return;
      }
    } catch (err) {
      console.log(err);
      res.status(403);
      res.json({ err: "Invalid authorization token" });
      return;
    }
  } else {
    res.status(403);
    res.json({ err: "Invalid authorization token" });
    return;
  }
};
