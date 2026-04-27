import express from "express"
import { loginUser, logout, registerUser, sendVerifyOtp, verifyEmail } from "../controllers/authController.js"
import isAuthenticated from "../middlewares/isAuthenticated.js"

const router = express.Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(logout)

router.route("/send-verify-otp").post(isAuthenticated, sendVerifyOtp)
router.route("/verify-email").post(isAuthenticated, verifyEmail)


export default router