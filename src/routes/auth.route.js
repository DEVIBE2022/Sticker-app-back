const express = require("express");
const router = express.Router();

const { AuthController } = require("../controllers");

// middleware for 3 and 4 routes

router.post("/register", [], AuthController.registerUser);
router.post("/login", [], AuthController.loginUser);
router.post("/forget-password", [], AuthController.forgetPassword);
router.post("/verify-otp", [], AuthController.verifyOtp);

module.exports = router;
