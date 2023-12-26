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

router.post("/createPage", isAuthenticatedUser, authorizeRoles("admin"), createPage);

router.put("/updatePage", isAuthenticatedUser, authorizeRoles("admin"), updatePage);

router.delete("/deletePage", isAuthenticatedUser, authorizeRoles("admin"), deletePage);

router.get("/getPage/:id", getPage);

router.get("/getAllPages", getAllPages);

module.exports = router;