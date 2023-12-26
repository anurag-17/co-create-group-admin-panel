const mongoose = require("mongoose");

const SubPagesSchema = new mongoose.Schema(
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
    pageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pages",
    },
  },
  {
    timestamps: true,
  }
);

const SubPages = mongoose.model("SubPages", SubPagesSchema);

module.exports = SubPages;