const mongoose = require("mongoose");

const ScheduleSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
    },
    number: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const Schedules = mongoose.model("Schedule", ScheduleSchema);

module.exports = Schedules;
