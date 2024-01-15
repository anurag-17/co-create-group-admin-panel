const mongoose = require("mongoose");

const PagesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      // unique: true,
      required: true,
    },
    subTitle: {
      type: String,
    },
    isSubpage: {
      type: Boolean,
      default: false
    },
    paragraph: {
      type: String,
    },
    bgUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Pages = mongoose.model("Pages", PagesSchema);

module.exports = Pages;
