const express = require("express");
const dotenv = require("dotenv");

const app = express();

app.use(express.json());

//Routes
const products = require("./routes/ProductRoutes.js");
app.use("/api/v1", products);
const user = require("./routes/userRoutes");
app.use("/api/v1", user);

module.exports = app;
