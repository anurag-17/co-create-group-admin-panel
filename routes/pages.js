const express = require('express');
const router = express.Router();

const {
    createPage,
    updatePage,
    deletePage,
    getPage,
    getAllPages,
} = require("../controller/pages");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

router.post("/createPage", createPage);

router.put("/updatePage", updatePage);

router.delete("/deletePage", deletePage);

router.get("/getPage/:id", getPage);

router.get("/getAllPages", getAllPages);

module.exports = router;