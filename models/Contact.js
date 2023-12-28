const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema(
  {
    number: {
      type: String,
    },
    email: {
      type: String,
    },
    address: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Contacts = mongoose.model("Contacts", ContactSchema);

module.exports = Contacts;
