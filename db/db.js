const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true,
    trim: false,
  },
  title: {
    type: String,
    required: true,
    trim: false,
    unique: true,
  },
  subtitle: {
    type: String,
    required: false,
    trim: false,
    unique: false,
  },
  intro: {
    type: String,
    required: false,
    trim: false,
  },
  sections: {
    type: Array,
    required: false,
    trim: false,
  },
  uri: {
    type: String,
    required: true,
    trim: true,
  },
  img: {
    type: String,
    required: false,
    trim: true,
  },
  post: {
    type: String,
    required: true,
    trim: true,
  },
});

const NewsModel = mongoose.model("News", newsSchema);
module.exports = NewsModel;
