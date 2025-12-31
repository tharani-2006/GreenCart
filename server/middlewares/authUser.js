import jwt from 'jsonwebtoken';

const authUser = (req, res, next) => {
    const {token} = req.cookies;

    if(!token) {
        return res.json({success: false, message: "Unauthorized access"});
    }

    try {
        const tokendecoded = jwt.verify(token, process.env.JWT_SECRET);
        if(tokendecoded.id) {
            req.body.userId = tokendecoded.id;
            next();
        } else {
            return res.json({success: false, message: "Unauthorized access"});
        }
    } catch (error) {
        return res.json({success: false, message: "Invalid token"});
    }
};

export default authUser;