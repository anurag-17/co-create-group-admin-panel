const mongoose = require("mongoose");

const PagesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      unique: true,
    },
    subTitle: {
      type: String,
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
