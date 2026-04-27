import express from "express"
import { loginUser, logout, registerUser, resetPassword, sendResetOtp, sendVerifyOtp, verifyEmail } from "../controllers/authController.js"
import isAuthenticated from "../middlewares/isAuthenticated.js"

const router = express.Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(logout)

router.route("/send-verify-otp").post(isAuthenticated, sendVerifyOtp)
router.route("/verify-email").post(isAuthenticated, verifyEmail)
router.route("/send-reset-otp").post(sendResetOtp)
router.route("/resetPassword").post(resetPassword)


export default router