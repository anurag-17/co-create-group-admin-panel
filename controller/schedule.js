const Schedule = require("../models/Schedule");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

// Create a new schedule
exports.createSchedule = asyncHandler(async (req, res) => {
  try {
    const newSchedule = await Schedule.create(req.body);
    res.status(201).json(newSchedule);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update an existing schedule
exports.updateSchedule = asyncHandler(async (req, res) => {
    const id = req.body._id;
  validateMongoDbId(id);

  try {
    const updatedSchedule = await Schedule.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedSchedule);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete an existing schedule
exports.deleteSchedule = asyncHandler(async (req, res) => {
    const id = req.body._id;
  validateMongoDbId(id);

  try {
    const deletedSchedule = await Schedule.findByIdAndDelete(id);
    res.json(deletedSchedule);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get details of a single schedule
exports.getSchedule = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const getSchedule = await Schedule.findById(id);
    res.json(getSchedule);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get all schedules
exports.getAllSchedules = asyncHandler(async (req, res) => {
    try {
      const { page = 1, limit = 20 } = req.query;
  
      const currentPage = parseInt(page, 10);
      const itemsPerPage = parseInt(limit, 10);
  
      const totalSchedules = await Schedule.countDocuments();
      const totalPages = Math.ceil(totalSchedules / itemsPerPage);
  
      const skip = (currentPage - 1) * itemsPerPage;
  
      const allSchedules = await Schedule.find()
        .skip(skip)
        .limit(itemsPerPage)
  
      res.json({
        current_page: currentPage,
        total_pages: totalPages,
        total_items: totalSchedules,
        schedules: allSchedules,
      });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
});  