const mongoose = require("mongoose");

const connectDB = () => {
  mongoose.connect(process.env.MONGO_URI).then((data) => {
    console.log(
      `DB connected with server: ${data.connection.host}:${data.connection.port}`
    );
  });
};

module.exports = connectDB;
