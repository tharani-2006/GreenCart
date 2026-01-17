import jwt from 'jsonwebtoken';

const authUser = (req, res, next) => {
    const {token} = req.cookies;

    if(!token) {
        return res.status(401).json({success: false, message: "Unauthorized access"});
    }

    try {
        if(!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is not set in environment variables");
            return res.status(500).json({success: false, message: "Server configuration error"});
        }

        const tokendecoded = jwt.verify(token, process.env.JWT_SECRET);
        if(tokendecoded.id) {
            // Initialize req.body if it's undefined (common for GET requests)
            if(!req.body) {
                req.body = {};
            }
            req.body.userId = tokendecoded.id;
            next();
        } else {
            return res.status(401).json({success: false, message: "Unauthorized access"});
        }
    } catch (error) {
        // Log the actual error for debugging
        console.error("Token verification error:", error.message);
        
        // Provide more specific error messages
        if(error.name === 'TokenExpiredError') {
            return res.status(401).json({success: false, message: "Token expired"});
        } else if(error.name === 'JsonWebTokenError') {
            return res.status(401).json({success: false, message: "Invalid token"});
        }
        return res.status(401).json({success: false, message: "Invalid token"});
    }
};

export default authUser;