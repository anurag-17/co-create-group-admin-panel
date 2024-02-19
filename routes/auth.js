const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  register,
  adminLogin,
  logout,
  forgotPassword,
  resetPassword,
  updatePassword,
  uploadImage,
  deleteData,
  chatApi,
  createThread,
  sendMessage,
  getMessage
} = require("../controller/auth");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.route("/adminLogin").post(adminLogin);

router.route("/logout").get(logout);

router.route("/register").post(register);

router.route("/chatApi").post(chatApi);

router.route("/create-thread").post(createThread);

router.route("/send-message").post(sendMessage);

router.route("/get-messages/:threadId").get(getMessage);

router.post("/updatePassword", isAuthenticatedUser, updatePassword);

router.route("/forgotpassword").post(forgotPassword);

router.route("/resetpassword/:resetToken").put(resetPassword);

router.route("/upload").post( upload.single('file'), uploadImage);

router.route("/remove-data").post(deleteData);

module.exports = router;