const Pages = require("../models/Pages");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

// Create a new page
exports.createPage = asyncHandler(async (req, res) => {
  const newPage = await Pages.create(req.body);
  res.status(201).json(newPage);
});

// Update an existing page
exports.updatePage = asyncHandler(async (req, res) => {
  const { id } = req.body;
  validateMongoDbId(id);

  const updatedPage = await Pages.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  res.json(updatedPage);
});

// Delete a page
exports.deletePage = asyncHandler(async (req, res) => {
  const { id } = req.body;
  validateMongoDbId(id);

  const deletedPage = await Pages.findByIdAndDelete(id);
  res.json(deletedPage);
});

// Get a single page by ID
exports.getPage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  const page = await Pages.findById(id);
  if (!page) {
    res.status(404).json({ error: "Page not found" });
    return;
  }

  res.json(page);
});

// Get all pages with pagination
exports.getAllPages = asyncHandler(async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const searchQuery = req.query.search;

    const pagesQuery = Pages.find();

    if (searchQuery) {
      pagesQuery.regex("title", new RegExp(searchQuery, "i"));
    }

    const total = await Pages.countDocuments(pagesQuery);

    const pages = await pagesQuery.skip(skip).limit(limit).exec();

    const totalPages = Math.ceil(total / limit);

    res.json({
      total,
      page,
      totalPages,
      pages,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

