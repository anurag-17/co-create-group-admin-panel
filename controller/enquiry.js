const Enquiry = require("../models/Enquiry");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

// Create a new enquiry
exports.createEnquiry = asyncHandler(async (req, res) => {
  try {
    const newEnquiry = await Enquiry.create(req.body);
    res.status(201).json(newEnquiry);
  } catch (error) {
    console.log(error.code);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update an existing enquiry
exports.updateEnquiry = asyncHandler(async (req, res) => {
  const { id } = req.body;
  validateMongoDbId(id);

  const updatedEnquiry = await Enquiry.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  res.json(updatedEnquiry);
});

// Delete an enquiry
exports.deleteEnquiry = asyncHandler(async (req, res) => {
  const { id } = req.body;
  validateMongoDbId(id);

  const deletedEnquiry = await Enquiry.findByIdAndDelete(id);
  res.json(deletedEnquiry);
});

// Get a single enquiry by ID
exports.getEnquiry = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  const enquiry = await Enquiry.findById(id);
  if (!enquiry) {
    res.status(404).json({ error: "Enquiry not found" });
    return;
  }

  res.json(enquiry);
});

// Get all enquiries with pagination
exports.getAllEnquiries = asyncHandler(async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const searchQuery = req.query.search;

    const enquiriesQuery = Enquiry.find();

    if (searchQuery) {
      enquiriesQuery.regex("email", new RegExp(searchQuery, "i"));
    }

    const total = await Enquiry.countDocuments(enquiriesQuery);

    const enquiries = await enquiriesQuery.skip(skip).limit(limit).exec();

    const totalPages = Math.ceil(total / limit);

    res.json({
      total,
      page,
      totalPages,
      enquiries,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});
