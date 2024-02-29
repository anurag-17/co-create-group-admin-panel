const express = require('express');
const router = express.Router();

const {
    createEnquiry,
    updateEnquiry,
    deleteEnquiry,
    getEnquiry,
    getAllEnquiries,
    enquiryData
} = require("../controller/enquiry");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

router.post("/createEnquiry", createEnquiry);

router.put("/updateEnquiry", updateEnquiry);

router.delete("/deleteEnquiry", deleteEnquiry);

router.get("/getEnquiry/:id", getEnquiry);

router.get("/getAllEnquiries", getAllEnquiries);

router.get("/enquiryData", enquiryData);

module.exports = router;
