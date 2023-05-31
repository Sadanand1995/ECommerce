const app = require("./app");
const dotenv = require("dotenv");
const path = require("path");

//config
dotenv.config({ path: `${path.join(__dirname, "./config/config.env")}` });

app.listen(process.env.PORT, () => {
  console.log(`Server is working on http://localhost:${process.env.PORT}`);
});
