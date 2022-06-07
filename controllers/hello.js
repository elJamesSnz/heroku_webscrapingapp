function getHello(req, res) {
  res.status(200).send({
    msg: "¡Hola Mundo desde controllers!",
  });
}

module.exports = {
  getHello,
};
