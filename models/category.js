import mongoose from "mongoose";

const categorySchema = mongoose.Schema({
  name: String,
  color: String,
});

const Category = new mongoose.model("Category", categorySchema);

export default Category;
