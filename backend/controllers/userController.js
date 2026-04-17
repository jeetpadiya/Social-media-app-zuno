import userModel from '../models/userSchema.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { sendEmail } from '../services/mailer.js'


const register = async (req, res) => {
    try {
        const { username, email, password } = req.body

        if (!username || !email || !password) {
            return res.status(400).json({ success: false, message: "All Fields Requrie" })
        }

        const avatarDP = req.file?.path
        if (!avatarDP) {
            return res.status(400).json({ success: false, message: "Avatar is Required" })
        }

        const existingUser = await userModel.findOne({ email })

        if (existingUser) {
            return res.status(409).json({ success: false, message: "User Already exist" })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({
            username,
            email,
            password: hashedPassword,
            avatar: avatarDP
        })
        await newUser.save()

        const token = jwt.sign({ id: newUser._id, email: newUser.email, name: newUser.username }, process.env.JWT_SECRET, { expiresIn: '7d' })

        res.cookie('token', token, {
            httpOnly: false,
            secure: false,
            sameSite: 'Lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        const userResponse = {
            id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            avatar: newUser.avatar
        }

        res.status(201).json({ success: true, message: "User Register successfully", user: userResponse, token: token })
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

const serachUser = async (req, res) => {
    try {

        const { username } = req.query
        if (!username) {
            return res.status(400).json({ success: false, message: "Username query parameter is required" })
        }
        const users = await userModel.find({ username: { $regex: username, $options: 'i' } }).select('-password')
        res.status(200).json({ success: true, users })

    }
    catch (error) {
        console.log(error);
        res.status(500).json({ sucess: false, message: "Internal Server Error" })
    }
}

const forgotPassword = async (req, res) => {

    try {


        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" })
        }

        const existingUser = await userModel.findOne({ email })
        if (!existingUser) {
            return res.status(404).json({ success: false, message: "User not found" })
        }

        const resetToken = crypto.randomBytes(32).toString("hex")
        const hashedRestToken = crypto.createHash("sha256").update(resetToken).digest("hex")

        existingUser.passwordResetToken = hashedRestToken
        existingUser.passwordResetExpires = new Date(Date.now() + 1000 * 60 * 15);

        await existingUser.save();

        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
        const resetUrl = `${frontendUrl.replace(/\/$/, "")}/reset-password/${resetToken}`;

        await sendEmail({ to: existingUser.email, resetUrl })

        res.status(200).json({ success: true, message: "Password reset email sent" })
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal Server Error" })

    }

}


const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;

        if (!token || !password) {
            return res.status(400).json({ message: "Token and password are required" });
        }
        console.log("TOKEN FROM BODY:", token)
        const hashedResetToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

            console.log("HASHED TOKEN:", hashedResetToken)
            
        const user = await userModel.findOne({
            passwordResetToken: hashedResetToken,
            passwordResetExpires: { $gt: new Date() }
        });

        console.log("USER FOUND:", user)

        if (!user) {
            return res.status(400).json({ message: "Reset token is invalid or expired" });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        user.passwordResetToken = null;
        user.passwordResetExpires = null;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Password reset successfully"
        });
    }
    catch (error) {
        console.error("Error resetting password:", error);
        res.status(500).json({ message: "Server error" });
    }
}


const login = async (req, res) => {
    try {
        const { email, password } = req.body


        if (!email || !password) {
            return res.status(400).json({ success: false, message: "All Fields Requrie" })
        }
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(404).json({ success: false, message: "user is not found" })
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: "Invalid credtions" })
        }

        const token = jwt.sign({ id: user._id, email: user.email, name: user.username }, process.env.JWT_SECRET, { expiresIn: '7d' })

        res.cookie('token', token, {
            httpOnly: false,
            secure: false,
            sameSite: 'Lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        const userResponse = {
            id: user._id,
            username: user.username,
            email: user.email,
            avatar: user.avatar
        }

        res.status(200).json({ success: true, message: "Login is succesfull", user: userResponse, token: token })

    }
    catch (error) {
        console.log(error);
        res.status(500).send({ success: false, messsage: "Internal server error" })
    }
}

const me = async (req, res) => {
    try {

        const user = await userModel.findById(req.user).select('-password')
        if (!user) {
            return res.status(404).json({ success: false, message: "User not Found" })
        }
        res.status(200).json({ success: true, currentUser: user })


    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, messsage: "Internal server error" })
    }
}

const UpdateUser = async (req, res) => {
    try {
        const { username, email } = req.body
        const updates = {}

        if (typeof username === 'string' && username.trim()) {
            updates.username = username.trim()
        }

        if (typeof email === 'string' && email.trim()) {
            updates.email = email.trim().toLowerCase()
        }

        if (req.file?.path) {
            updates.avatar = req.file.path
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ success: false, message: "No valid fields provided for update" })
        }

        if (updates.email) {
            const existingEmailUser = await userModel.findOne({
                email: updates.email,
                _id: { $ne: req.user }
            })

            if (existingEmailUser) {
                return res.status(409).json({ success: false, message: "Email already in use" })
            }
        }

        if (updates.username) {
            const existingUsernameUser = await userModel.findOne({
                username: updates.username,
                _id: { $ne: req.user }
            })

            if (existingUsernameUser) {
                return res.status(409).json({ success: false, message: "Username already in use" })
            }
        }

        const user = await userModel.findByIdAndUpdate(
            req.user,
            updates,
            { new: true, runValidators: true }
        ).select('-password')

        if (!user) {
            return res.status(404).json({ success: false, message: "User not Found" })
        }
        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            currentUser: user
        })

    }
    catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

const getUserById = async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id).select('-password')
        if (!user) {
            return res.status(404).json({ success: false, message: "User not Found" })
        }
        res.status(200).json({ success: true, user })
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, messsage: "Internal server error" })
    }
}


export { register, login, me, getUserById, UpdateUser, serachUser, forgotPassword, resetPassword }
