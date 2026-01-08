import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

// Place Order : /api/order/place
export const placeOrder = async (req, res) => {
    try {
        const userId = req.body.userId;
        const { items, amount, address, paymentType } = req.body;

        if(!items || items.length === 0 || !amount || !address || !paymentType) {
            return res.json({success: false, message: "All fields are required"});
        }

        // Create order
        const order = await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType,
            isPaid: paymentType === "Online" ? true : false,
        });

        // Clear user cart
        const user = await User.findById(userId);
        if(user) {
            user.cartItems = {};
            await user.save();
        }

        // Populate order details
        const populatedOrder = await Order.findById(order._id)
            .populate("items.product")
            .populate("address");

        return res.json({success: true, message: "Order placed successfully", order: populatedOrder});
    } catch (error) {
        console.error("Error in placing order:", error);
        res.status(500).json({success: false, message: "Server Error"});
    }
}; 