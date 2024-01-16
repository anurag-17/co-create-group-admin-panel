const express = require('express');
const router = express.Router();

const {
    createSchedule,
    updateSchedule,
    deleteSchedule,
    getSchedule,
    getAllSchedules,
} = require("../controller/schedule");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

router.post("/createSchedule",  createSchedule);

router.put("/updateSchedule", updateSchedule);

router.delete("/deleteSchedule", deleteSchedule);

router.get("/getSchedule/:id", getSchedule);

router.get("/getAllSchedules", getAllSchedules);

module.exports = router;