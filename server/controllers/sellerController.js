

// Login Seller : /api/seller/login

export const sellerLogin = async (req, res) => {
    try {
        const {email, password} = req.body;

        if(password === process.env.SELLER_PASSWORD && email === process.env.SELLER_EMAIL) {
            const token = jwt.sign({email: email}, process.env.JWT_SECRET, {expiresIn: "7d"});
            res.cookie("sellerToken", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            return res.json({success: true, message: "Seller logged in successfully"});
        } else {
            return res.json({success: false, message: "Invalid email or password"});
        }
    } catch (error) {
        console.error("Error in seller login:", error);
        res.status(500).json({success: false, message: "Server Error"});
    }
}

// Seller isAuth : /api/seller/is-auth
export const isSellerAuth = async (req, res) => {
    try{
        return res.json({success: true, message: "Seller is authenticated"});
    } catch (error) {
        console.error("Error in seller isAuth:", error);
        res.status(500).json({success: false, message: "Server Error"});
    }
}

//Logout Seller : /api/seller/logout
export const sellerLogout = async (req, res) => {
    try {
        res.clearCookie("sellerToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        });
        return res.json({success: true, message: "Seller logged out successfully"});
    } catch (error) {
        console.error("Error in seller logout:", error);
        res.status(500).json({success: false, message: "Server Error"});
    }
}