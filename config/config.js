const dbUrl = `mongodb+srv://${process.env.MONGOSV}:${process.env.MONGOPW}@${process.env.MONGOURI}`;

console.log(dbUrl);

const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

module.exports = {
  dbUrl: dbUrl,
  connectionParams: connectionParams,
};
