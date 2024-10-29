// server.js
const dotenv = require("dotenv"); // Import dotenv
const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");

// Load environment variables from .env file
dotenv.config();

// MongoDB URI
const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("Missing MONGODB_URI environment variable");
}
const options = { useNewUrlParser: true, useUnifiedTopology: true };

// Initialize Express app
const app = express();
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies

// Create a MongoDB client
const client = new MongoClient(uri, options);

// Connect to MongoDB
const connectToDatabase = async () => {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

// Sample API endpoint for categories
app.get("/api/categories", async (req, res) => {
  try {
    const categoriesCollection = client
      .db("e-commerce")
      .collection("categories");
    const categories = await categoriesCollection.find().toArray();
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectToDatabase();
});
