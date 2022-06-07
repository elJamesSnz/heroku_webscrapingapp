const mongoose = require("mongoose");

const categoriesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: false,
    unique: true,
  },
});

const CategoriesModel = mongoose.model("categories", categoriesSchema);
module.exports = CategoriesModel;
