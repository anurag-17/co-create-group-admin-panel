const mongoose = require("mongoose");

const NewsletterSchema = new mongoose.Schema(
  {
    email: {
      type: String,
    }
  },
  {
    timestamps: true,
  }
);

const Newsletter = mongoose.model("Newsletter", NewsletterSchema);

module.exports = Newsletter;
