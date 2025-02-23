const mongoose = require("mongoose");

//db connection
const connectDatabase = () => {
  console.log("MONGO_URL from .env:", process.env.MONGO_URL); // Debugging line
  require("dotenv").config();
console.log("JWT_SECRET from .env:", process.env.JWT_SECRET);


  mongoose
    .connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((data) => {
      console.log(`Mongodb connected with server: ${data.connection.host}`);
    })
    .catch((err) => {
      console.log(`Error: ${err.message}`);
      process.exit(1); // Exit if connection fails
    });
};

module.exports = connectDatabase;
