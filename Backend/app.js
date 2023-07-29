const express = require("express");
const app = express();
const errorMiddleware = require("./middleware/error");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());

//importing routes
const products = require("./routes/ProductRoutes");
app.use("/api/v1", products);

const users = require("./routes/userRoutes");
app.use("/api/v1", users);

//error middleware
app.use(errorMiddleware);

module.exports = app;
