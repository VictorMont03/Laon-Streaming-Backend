class HomeController {
  async index(req, res) {
    res.send("API EXPRESS");
  }
}

module.exports = new HomeController();
