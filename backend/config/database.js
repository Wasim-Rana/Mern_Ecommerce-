const mongoose = require("mongoose");

//db connection
const connectDatabase = () => {
  console.log("MONGO_URL from .env:", process.env.MONGO_URL); // Debugging line

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
