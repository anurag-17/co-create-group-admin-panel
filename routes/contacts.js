const express = require('express');
const router = express.Router();

const {
    createContact,
    updateContact,
    deleteContact,
    getContact,
    getAllContacts,
} = require("../controller/contact");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

router.post("/createContact", createContact);

router.put("/updateContact", updateContact);

router.delete("/deleteContact", deleteContact);

router.get("/getContact/:id", getContact);

router.get("/getAllContacts", getAllContacts);

module.exports = router;
