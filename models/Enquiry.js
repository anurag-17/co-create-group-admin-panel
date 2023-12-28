const mongoose = require("mongoose");

const EnquirySchema = new mongoose.Schema(
  {
    email: {
      type: String,
    }
  },
  {
    timestamps: true,
  }
);

const Enquiry = mongoose.model("Enquiry", EnquirySchema);

module.exports = Enquiry;
