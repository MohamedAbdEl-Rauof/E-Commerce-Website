import mongoose from "mongoose";

// Define the schema for categories
const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Name of the category
    image: { type: String, required: true }, // URL for the category image
  },
  {
    timestamps: true, // Automatically creates createdAt and updatedAt fields
  }
);

// Export the model
export default mongoose.models.Category ||
  mongoose.model("Category", categorySchema);
