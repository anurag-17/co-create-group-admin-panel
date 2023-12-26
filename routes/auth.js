const express = require('express');
const router = express.Router();

const {
  register,
  adminLogin,
  logout,
  forgotPassword,
  resetPassword,
  updatePassword,
} = require("../controller/auth");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

router.route("/adminLogin").post(adminLogin);

router.route("/logout").get(logout);

router.route("/register").post(register);

router.post("/updatePassword", isAuthenticatedUser, updatePassword);

router.route("/forgotpassword").post(forgotPassword);

router.route("/resetpassword/:resetToken").put(resetPassword);


module.exports = router;