const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  forgorPassword,
  resetPassword,
  getUserDetails,
  updatePassword,
  updateUserDetails,
} = require("../controller/userController");
const { isAuthenticatedUser, userRole } = require("../middleware/auth");

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/password/forgot").post(forgorPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/logout").get(logoutUser);
router.route("/me").get(isAuthenticatedUser, getUserDetails);
router.route("/password/update").put(isAuthenticatedUser, updatePassword);
router.route("/me/update").put(isAuthenticatedUser, updateUserDetails);

module.exports = router;
