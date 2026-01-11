import Address from "../models/Address.js";

// Add Address : /api/address/add
export const addAddress = async (req, res)=>{
    try {
        const { address, userId } = req.body;
        await Address.create({...address, userId});
        res.json({success: true, message: "Address added successfully"});
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Get All Addresses : /api/address/all
export const getAddresses = async (req, res)=>{
    try {
        const userId = req.body.userId;
        const addresses = await Address.find({ userId }).sort({ createdAt: -1 });
        res.json({success: true, addresses});
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Update Address : /api/address/update/:id
export const updateAddress = async (req, res)=>{
    try {
        const { id } = req.params;
        const userId = req.body.userId;
        const { address } = req.body;

        const existingAddress = await Address.findOne({ _id: id, userId });
        if(!existingAddress) {
            return res.json({success: false, message: "Address not found"});
        }

        await Address.findByIdAndUpdate(id, {...address, userId}, { new: true });
        res.json({success: true, message: "Address updated successfully"});
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Delete Address : /api/address/delete/:id
export const deleteAddress = async (req, res)=>{
    try {
        const { id } = req.params;
        const userId = req.body.userId;

        const address = await Address.findOne({ _id: id, userId });
        if(!address) {
            return res.json({success: false, message: "Address not found"});
        }

        await Address.findByIdAndDelete(id);
        res.json({success: true, message: "Address deleted successfully"});
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

