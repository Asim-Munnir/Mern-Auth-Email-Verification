import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import transporter from "../utils/nodemailer.js";

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

        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60 * 1000
        })

        // sending welcome email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Welcome! We’re glad to have you here 🚀",
            // text: `Welcome to Our Website. Your account has been created with email id: ${email}`
            html: `
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 40px 20px;">
        <div style="max-width: 500px; margin: auto; background: #ffffff; border-radius: 10px; padding: 35px; text-align: center; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
            
            <h1 style="color: #4f46e5; margin-bottom: 15px;">
                Welcome Aboard 🎉
            </h1>

            <p style="font-size: 16px; color: #555; line-height: 1.6;">
                We're excited to have you join our platform.
                <br/><br/>
                Your account has been successfully created with:
            </p>

            <div style="background: #eef2ff; padding: 14px 20px; border-radius: 8px; margin: 25px 0; display: inline-block;">
                <span style="font-size: 18px; font-weight: bold; color: #111827;">
                    ${email}
                </span>
            </div>

            <p style="font-size: 15px; color: #666; line-height: 1.6;">
                You can now explore all features and enjoy the experience with us.
            </p>

            <a href="#" 
               style="display: inline-block; margin-top: 25px; padding: 12px 24px; background: #4f46e5; color: #fff; text-decoration: none; border-radius: 6px; font-weight: bold;">
               Get Started
            </a>

            <hr style="margin: 35px 0; border: none; border-top: 1px solid #e5e7eb;" />

            <p style="font-size: 12px; color: #9ca3af;">
                Thank you for choosing our platform 💜
            </p>

        </div>
    </div>
    `
        }

        await transporter.sendMail(mailOptions);

        return res.status(201).json({
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

// send verification OTP to the user's email
export const sendVerifyOtp = async (req, res) => {
    try {

        const userId = req.user._id

        let user = await User.findById(userId)
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User Not Found"
            })
        }

        if (user.isAccountVerified) {
            return res.status(200).json({
                success: true,
                message: "Account Already Verified"
            })
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString()

        user.verifyOtp = otp
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000

        await user.save()

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Account Verification OTP",
            // text: `Your OTP is ${otp}. Verify your account using this OTP`
            html: `
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 40px 20px;">
        <div style="max-width: 500px; margin: auto; background: #ffffff; border-radius: 10px; padding: 30px; text-align: center; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
            
            <h2 style="color: #4f46e5; margin-bottom: 10px;">
                Email Verification
            </h2>

            <p style="color: #555; font-size: 16px; line-height: 1.5;">
                Hello,
                <br/><br/>
                Thank you for registering with us. Please use the OTP below to verify your email address.
            </p>

            <div style="margin: 30px 0;">
                <span style="display: inline-block; font-size: 32px; letter-spacing: 8px; font-weight: bold; color: #111827; background: #eef2ff; padding: 15px 25px; border-radius: 8px;">
                    ${otp}
                </span>
            </div>

            <p style="color: #666; font-size: 14px;">
                This OTP is valid for a limited time. Please do not share it with anyone.
            </p>

            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;" />

            <p style="font-size: 12px; color: #9ca3af;">
                If you did not create an account, you can safely ignore this email.
            </p>

        </div>
    </div>
    `
        }

        await transporter.sendMail(mailOptions)

        return res.status(200).json({
            success: true,
            message: "Verification OTP sent on Email"
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        })
    }
}


export const verifyEmail = async (req, res) => {

    const userId = req.user._id
    const { otp } = req.body

    if (!userId || !otp) {
        return res.status(400).json({
            success: false,
            message: "Missing Details...!"
        })
    }

    try {

        let user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User Not Found"
            })
        }

        if (user.verifyOtp === '' || user.verifyOtp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            })
        }

        if (!user.verifyOtpExpireAt || user.verifyOtpExpireAt < Date.now()) {
            return res.status(400).json({
                success: false,
                message: "OTP Expired"
            });
        }

        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;

        await user.save()

        return res.status(200).json({
            success: true,
            message: "Account Verified Successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        })
    }
}


// check if user is authenticated

export const isAuthenticatedUser = async (req, res) => {
    try {
        return res.json({
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        })
    }
}


// send password reset OTP

export const sendResetOtp = async (req, res) => {

    try {
        const { email } = req.body

        if (!email) {
            return res.status(404).json({
                success: false,
                message: "Email is required"
            })
        }

        let user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User Not Found"
            })
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString()

        user.resetOtp = otp
        user.resetOtpExpireAT = Date.now() + 15 * 60 * 1000

        await user.save()

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Password Reset OTP",
            // text: `Your OTP for reseting your password is ${otp}. Use this OTP to proceed with resetting your password.`
            html: `
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 40px 20px;">
        <div style="max-width: 500px; margin: auto; background: #ffffff; border-radius: 10px; padding: 35px; text-align: center; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
            
            <h2 style="color: #dc2626; margin-bottom: 15px;">
                Password Reset Request 🔐
            </h2>

            <p style="font-size: 16px; color: #555; line-height: 1.6;">
                We received a request to reset your password.
                <br/><br/>
                Use the OTP below to continue resetting your password:
            </p>

            <div style="margin: 30px 0;">
                <span style="display: inline-block; font-size: 32px; letter-spacing: 8px; font-weight: bold; color: #111827; background: #fee2e2; padding: 15px 25px; border-radius: 8px;">
                    ${otp}
                </span>
            </div>

            <p style="font-size: 14px; color: #666; line-height: 1.6;">
                This OTP will expire shortly for security reasons.
                <br/>
                Please do not share this code with anyone.
            </p>

            <hr style="margin: 35px 0; border: none; border-top: 1px solid #e5e7eb;" />

            <p style="font-size: 12px; color: #9ca3af;">
                If you did not request a password reset, you can safely ignore this email.
            </p>

        </div>
    </div>
    `
        }

        await transporter.sendMail(mailOptions)

        return res.status(200).json({
            success: true,
            message: "Password Reset OTP sent on Email"
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        })
    }
}

// Reset User Password
export const resetPassword = async (req, res) => {

    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.status(400).json({
            success: false,
            message: "All field are required"
        })
    }

    try {

        let user = await User.findOne({ email })

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.resetOtp === "" || user.resetOtp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            })
        }

        if (!user.resetOtpExpireAT || user.resetOtpExpireAT < Date.now()) {
            return res.status(400).json({
                success: false,
                message: "OTP Expired"
            });
        }

        const hashPassword = await bcrypt.hash(newPassword, 10)

        user.password = hashPassword
        user.resetOtp = '';
        user.resetOtpExpireAT = 0

        await user.save()

        return res.status(200).json({
            success: true,
            message: "Password reset successfully",
        });


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        })
    }
}