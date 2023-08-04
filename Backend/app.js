const express = require("express");
const app = express();
const errorMiddleware = require("./middleware/error");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());

//importing routes
const products = require("./routes/ProductRoutes");
const users = require("./routes/userRoutes");
const orders = require("./routes/orderRoutes");

app.use("/api/v1", products);
app.use("/api/v1", users);
app.use("/api/v1", orders);

//error middleware
app.use(errorMiddleware);

module.exports = app;
