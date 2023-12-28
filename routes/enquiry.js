const express = require('express');
const router = express.Router();

const {
    createEnquiry,
    updateEnquiry,
    deleteEnquiry,
    getEnquiry,
    getAllEnquiries,
} = require("../controller/enquiry");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

router.post("/createEnquiry", createEnquiry);

router.put("/updateEnquiry", updateEnquiry);

router.delete("/deleteEnquiry", deleteEnquiry);

router.get("/getEnquiry/:id", getEnquiry);

router.get("/getAllEnquiries", getAllEnquiries);

module.exports = router;
