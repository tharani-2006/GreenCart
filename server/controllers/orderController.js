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

// Get My Orders : /api/order/my-orders
export const getMyOrders = async (req, res) => {
    try {
        const userId = req.body.userId;
        const orders = await Order.find({ userId })
            .populate("items.product")
            .populate("address")
            .sort({ createdAt: -1 });
        return res.json({success: true, orders});
    } catch (error) {
        console.error("Error in fetching orders:", error);
        res.status(500).json({success: false, message: "Server Error"});
    }
};

// Get All Orders (Seller) : /api/order/all
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate("items.product")
            .populate("address")
            .populate("userId", "name email")
            .sort({ createdAt: -1 });
        return res.json({success: true, orders});
    } catch (error) {
        console.error("Error in fetching all orders:", error);
        res.status(500).json({success: false, message: "Server Error"});
    }
};

// Update Order Status : /api/order/update-status/:id
export const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if(!status) {
            return res.json({success: false, message: "Status is required"});
        }

        const order = await Order.findById(id);
        if(!order) {
            return res.json({success: false, message: "Order not found"});
        }

        order.status = status;
        await order.save();

        const populatedOrder = await Order.findById(order._id)
            .populate("items.product")
            .populate("address");

        return res.json({success: true, message: "Order status updated successfully", order: populatedOrder});
    } catch (error) {
        console.error("Error in updating order status:", error);
        res.status(500).json({success: false, message: "Server Error"});
    }
};


