import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//Register User : /api/user/register
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if(!name || !email || !password) {
            return res.json({succes:false, message: "All fields are required"});
        }

        const existingUser = await User.findOne({ email });
        if(existingUser) {
            return res.json({success: false, message: "User already exists"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "1d"}); 
        res.json({ success: true, message: "User registered successfully" });

    } catch (error) {
        console.error("Error in user registration:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};