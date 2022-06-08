require("dotenv").config();
const cors = require("cors");
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

const app = require("./app");
//app.use(cors());
app.use(cors(corsOptions));

const port = process.env.PORT || 3977;

const mongoose = require("mongoose");
const db = require("./config/config");

mongoose
  .connect(db.dbUrl, db.connectionParams)
  .then(() => {
    console.info("Connected to the DB");
  })
  .catch((e) => {
    console.log("Error: {db connection}", e);
  });

app.listen(port, () => {
  console.log(`Servidor del API REST esta funcionando en puerto ${port}`);
});

/*
  //CÓDIGO PARA PRUEBAS INTERNAS
  require("dotenv").config();
const cors = require("cors");
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

const app = require("./app");
//app.use(cors());
app.use(cors(corsOptions));

const port = process.env.PORT || 3977;

const mongoose = require("mongoose");
const db = require("./config/config");

mongoose
  .connect(db.dbUrl, db.connectionParams)
  .then(() => {
    console.info("Connected to the DB");
  })
  .catch((e) => {
    console.log("Error: {db connection}", e);
  });

app.listen(3000, "192.168.47.1", () => {
  console.log(`Servidor del API REST esta funcionando en puerto ${port}`);
});


*/
