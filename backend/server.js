require("dotenv").config({ path: ".env" });

const app = require("./app");
const cloudinary = require("cloudinary");
const stripe = require("stripe")(process.env.STRIPE_SECRET);

//config env
// if (process.env.NODE_ENV !== "PRODUCTION") {
//   require("dotenv").config({ path: "backend/.env" });
// }



console.log("JWT_SECRET from .env:", process.env.JWT_SECRET);
console.log("MONGO_URL from .env:", process.env.MONGO_URL);
console.log("PORT from .env:", process.env.PORT);
console.log("STRIPE_API_KEY:", process.env.STRIPE_API_KEY);
console.log("STRIPE_SECRET:", process.env.STRIPE_SECRET);

//connecting db
const connectDatabase = require("./config/database");
connectDatabase();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//connecting server
const server = app.listen(process.env.PORT, () => {
  console.log(`server is working in http://localhost:${process.env.PORT}`);
});

// Uncaught error handling
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(" Server is shuting down due to uncaught Error");

  server.close(() => {
    process.exit(1);
  });
});

// unhandled error rejection handle

process.on("unhandledRejection", (err) => {
  console.log(`error : ${err.message}`);
  console.log("Server shuting down due to unhandeled promise rejection ");

  server.close(() => {
    process.exit(1);
  });
});


