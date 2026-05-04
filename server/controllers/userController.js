import { User } from "../models/userModel.js"


export const getUserData = async (req, res) => {
    try {

        const userId = req.user?.id

        const user = await User.findById(userId).select("-password")
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }

        return res.status(200).json({
            success: true,
            userData: {
                name: user?.name,
                isAccountVerified: user?.isAccountVerified
            }
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        })
    }
}