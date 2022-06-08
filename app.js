const express = require("express");
const app = express();
const users = require("./routes/newsRoutes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cargar rutas
const hello_routes = require("./routes/hello");

// Rutas base
app.use("/api", hello_routes);

//rutas
users(app);

module.exports = app;
