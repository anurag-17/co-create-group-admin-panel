const Contacts = require("../models/Contact");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

// Create a new contact
exports.createContact = asyncHandler(async (req, res) => {
  try {
    const newContact = await Contacts.create(req.body);
    res.status(201).json(newContact);
  } catch (error) {
    console.log(error.code);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update an existing contact
exports.updateContact = asyncHandler(async (req, res) => {
  const { id } = req.body;
  validateMongoDbId(id);

  const updatedContact = await Contacts.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  res.json(updatedContact);
});

// Delete a contact
exports.deleteContact = asyncHandler(async (req, res) => {
  const { id } = req.body;
  validateMongoDbId(id);

  const deletedContact = await Contacts.findByIdAndDelete(id);
  res.json(deletedContact);
});

// Get a single contact by ID
exports.getContact = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  const contact = await Contacts.findById(id);
  if (!contact) {
    res.status(404).json({ error: "Contact not found" });
    return;
  }

  res.json(contact);
});

// Get all contacts with pagination
exports.getAllContacts = asyncHandler(async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const searchQuery = req.query.search;

    const contactsQuery = Contacts.find();

    if (searchQuery) {
      contactsQuery.regex("number", new RegExp(searchQuery, "i"));
    }

    const total = await Contacts.countDocuments(contactsQuery);

    const contacts = await contactsQuery.skip(skip).limit(limit).exec();

    const totalPages = Math.ceil(total / limit);

    res.json({
      total,
      page,
      totalPages,
      contacts,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});
