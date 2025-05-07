const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/userModel"); 

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/ecom", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Function to create an admin user
const createAdmin = async () => {
  try {
    // const hashedPassword = await bcrypt.hash("admin123", 10); // Hash password
    const adminUser = new User({
      name: "Admin User",
      email: "admin@gmail.com",
      password: "admin123",
      role: "admin",
    });

    await adminUser.save();
    console.log("✅ Admin user created successfully in `ecom.users` collection.");
    mongoose.connection.close();
  } catch (error) {
    console.log("❌ Error creating admin:", error);
    mongoose.connection.close();
  }
};

createAdmin();
