const app = require("./app");
const connectDB = require("./config/database");
const dotenv = require("dotenv");

//handling uncaught exception error
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down server due to uncaught exception`);
  process.exit(1);
});

//config env file
dotenv.config({ path: `${__dirname}/config/config.env` });

//connct DB
connectDB();

const server = app.listen(process.env.PORT, () => {
  console.log(
    `serever is running on ${process.env.ADDRESS}:${process.env.PORT}`
  );
});

//handling unhandeled promise rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down server due to unhandeled promise rejection`);

  server.close(() => {
    process.exit(1);
  });
});
