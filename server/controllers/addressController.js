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

// Get All Addresses : /api/address/all
export const getAddresses = async (req, res) => {
    try {
        const userId = req.body.userId;
        const addresses = await Address.find({ userId }).sort({ createdAt: -1 });
        return res.json({success: true, addresses});
    } catch (error) {
        console.error("Error in fetching addresses:", error);
        res.status(500).json({success: false, message: "Server Error"});
    }
};

// Update Address : /api/address/update/:id
export const updateAddress = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.body.userId;
        const { firstName, lastName, email, street, city, state, zipcode, country, phone } = req.body;

        const address = await Address.findOne({ _id: id, userId });
        if(!address) {
            return res.json({success: false, message: "Address not found"});
        }

        const updateData = {};
        if(firstName) updateData.firstName = firstName;
        if(lastName) updateData.lastName = lastName;
        if(email) updateData.email = email;
        if(street) updateData.street = street;
        if(city) updateData.city = city;
        if(state) updateData.state = state;
        if(zipcode) updateData.zipcode = zipcode;
        if(country) updateData.country = country;
        if(phone) updateData.phone = phone;

        const updatedAddress = await Address.findByIdAndUpdate(id, updateData, { new: true });
        return res.json({success: true, message: "Address updated successfully", address: updatedAddress});
    } catch (error) {
        console.error("Error in updating address:", error);
        res.status(500).json({success: false, message: "Server Error"});
    }
};

// Delete Address : /api/address/delete/:id
export const deleteAddress = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.body.userId;

        const address = await Address.findOne({ _id: id, userId });
        if(!address) {
            return res.json({success: false, message: "Address not found"});
        }

        await Address.findByIdAndDelete(id);
        return res.json({success: true, message: "Address deleted successfully"});
    } catch (error) {
        console.error("Error in deleting address:", error);
        res.status(500).json({success: false, message: "Server Error"});
    }
};

