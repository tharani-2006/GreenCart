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

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "7d"});
         
        res.cookie("token", token, {
            httpOnly: true, // prevent JavaScript to access cookie
            secure : process.env.NODE_ENV === "production", // use secure cookies in production
            sameSite : process.env.NODE_ENV === "production" ? "none" : "strict", //CSRF protection
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days for cookie expiry
        })

        return res.json({success: true, message: "User registered successfully", user: {
            id: user._id,
            name: user.name,
            email: user.email,
        }})

    } catch (error) {
        console.error("Error in user registration:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

//Login User : /api/user/login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if(!email || !password) {
            return res.json({succes:false, message: "All fields are required"});
        }

        const user = await User.findOne({ email });

        if(!user) {
            return res.json({success: false, message: "Invalid email or password"});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) {
            return res.json({success: false, message: "Invalid email or password"});
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "7d"});

        res.cookie("token", token, {
            httpOnly: true, // prevent JavaScript to access cookie
            secure : process.env.NODE_ENV === "production", // use secure cookies in production
            sameSite : process.env.NODE_ENV === "production" ? "none" : "strict", //CSRF protection
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days for cookie expiry
        })

        return res.json({success: true, message: "User logged in successfully", user: {
            id: user._id,
            name: user.name,
            email: user.email,
        }})

    } catch (error) {
        console.error("Error in user login:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

//Check Auth : api/user/is-auth
export const isAuth = async (req, res) => {
    try {
        const userId = req.body.userId;
        const user = await User.findById(userId).select("-password");
        return res.json({success: true, user});
    } catch (error) {
        console.error("Error in checking auth:", error);
        res.json({ success: false, message: error.message });
    }
};

//Logout User : /api/user/logout
export const logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure : process.env.NODE_ENV === "production",
            sameSite : process.env.NODE_ENV === "production" ? "none" : "strict",
        });
        return res.json({success: true, message: "User logged out successfully"});
    }
    catch (error) {
        console.error("Error in user logout:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}