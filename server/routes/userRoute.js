import express from "express"
import { getUserData } from "../controllers/userController.js"
import isAuthenticated from "../middlewares/isAuthenticated.js"

const router = express.Router()

router.route("/userdata").get(isAuthenticated, getUserData)

export default router