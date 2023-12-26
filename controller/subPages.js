const SubPages = require("../models/SubPages");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

// Create a new subpage
exports.createSubPage = asyncHandler(async (req, res) => {
  const newSubPage = await SubPages.create(req.body);
  res.status(201).json(newSubPage);
});

// Update an existing subpage
exports.updateSubPage = asyncHandler(async (req, res) => {
  const { id } = req.body;
  validateMongoDbId(id);

  const updatedSubPage = await SubPages.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  res.json(updatedSubPage);
});

// Delete a subpage
exports.deleteSubPage = asyncHandler(async (req, res) => {
  const { id } = req.body;
  validateMongoDbId(id);

  const deletedSubPage = await SubPages.findByIdAndDelete(id);
  res.json(deletedSubPage);
});

// Delete multiple subpages
exports.deleteBulkSubPages = asyncHandler(async (req, res) => {
  const { subPageIds } = req.body;
  const deletedSubPages = await SubPages.deleteMany({ _id: { $in: subPageIds } });
  res.json(deletedSubPages);
});

// Get a single subpage by ID
exports.getSubPage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  const subPage = await SubPages.findById(id).populate('pageId');
  if (!subPage) {
    res.status(404).json({ error: "SubPage not found" })
    return;
  }

  res.json(subPage);
});

// Get all subpages with pagination
exports.getAllSubPages = asyncHandler(async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const searchQuery = req.query.search;

    const subPagesQuery = SubPages.find().populate('pageId');

    if (searchQuery) {
      subPagesQuery.regex("title", new RegExp(searchQuery, "i"));
    }

    const total = await SubPages.countDocuments(subPagesQuery);

    const subPages = await subPagesQuery.skip(skip).limit(limit).exec();

    res.json({
      total,
      page,
      subPages,
    });
    
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});
