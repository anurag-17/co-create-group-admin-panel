const SubPages = require("../models/SubPages");
const Pages = require("../models/Pages");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

// Create a new subpage
exports.createSubPage = asyncHandler(async (req, res) => {
  try {
    const newSubPage = await SubPages.create(req.body);
    res.status(201).json(newSubPage);
  } catch (error) {
    if (error.code === 11000 && error.keyPattern.title) {
      // Duplicate key error (title is not unique)
      res.status(400).json({ error: "Title must be unique" });
    } else {
      // Other errors
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
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

    const totalPages = Math.ceil(total / limit);

    res.json({
      total,
      page,
      totalPages,
      subPages,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

exports.subPages = asyncHandler(async (req, res) => {
  const { pageId } = req.params;

  try {
    // Find the Pages document with the given _id and isSubpage=true
    const page = await Pages.findOne({ _id: pageId, isSubpage: true });

    if (!page) {
      return res.status(404).json({ error: "Subpage not found" });
    }

    // Find the SubPages documents with the matching pageId
    const subpages = await SubPages.find({ pageId: page._id });

    res.json({ page, subpages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});