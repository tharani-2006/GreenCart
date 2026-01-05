import Address from "../models/Address.js";

// Add Address : /api/address/add
export const addAddress = async (req, res) => {
    try {
        const userId = req.body.userId;
        const { firstName, lastName, email, street, city, state, zipcode, country, phone } = req.body;

        if(!firstName || !lastName || !email || !street || !city || !state || !zipcode || !country || !phone) {
            return res.json({success: false, message: "All fields are required"});
        }

        const address = await Address.create({
            userId,
            firstName,
            lastName,
            email,
            street,
            city,
            state,
            zipcode,
            country,
            phone,
        });

        return res.json({success: true, message: "Address added successfully", address});
    } catch (error) {
        console.error("Error in adding address:", error);
        res.status(500).json({success: false, message: "Server Error"});
    }
};
