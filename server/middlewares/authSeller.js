import jwt from 'jsonwebtoken';

const authSeller = (req, res, next) => {
    const {sellerToken} = req.cookies;

    if(!sellerToken) {
        return res.json({success: false, message: "Unauthorized access"});
    }
    try {
        const tokenDecoded = jwt.verify(sellerToken, process.env.JWT_SECRET);
        if(tokenDecoded.email == process.env.SELLER_EMAIL) {
            next();
        } else {
            return res.json({success: false, message: "Unauthorized access"});
        }
    } catch (error) {
        return res.json({success: false, message: "Invalid token"});
    }
};

export default authSeller;
