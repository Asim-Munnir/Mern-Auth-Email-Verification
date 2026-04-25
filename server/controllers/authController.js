import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const registerUser = async (req, res) => {

    const { name, email, password } = req.body;

    if (!name?.trim() || !email?.trim() || !password?.trim()) {
        return res.status(400).json({
            success: false,
            message: "All Fields are Required"
        })
    }

    try {
        const user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({
                success: false,
                message: "User Already Exist With This Email"
            })
        }

        // hash password
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)

        const newUser = await User.create({
            name,
            email,
            password: hashPassword
        })

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' })

        return res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60 * 1000
        }).status(201).json({
            success: true,
            message: "Account Created Successfully",
            newUser
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        })
    }
}


export const loginUser = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "All Fields Are Required"
        })
    }

    try {

        let user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User Does Not exist"
            })
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password)
        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: "Incorrect Email Or Password"
            })
        }

        // generate jwt
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' })

        user = {
            _id: user._id,
            name: user.name,
            email: user.email,
        }

        return res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60 * 1000
        }).status(200).json({
            message: `Welcome back ${user.name}`,
            success: true,
            user
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        })
    }
}


export const logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        });

        return res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        })
    }
}