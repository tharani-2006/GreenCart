import express from 'express';
import { placeOrder, getMyOrders, getAllOrders, updateOrderStatus } from '../controllers/orderController.js';
import authUser from '../middlewares/authUser.js';
import authSeller from '../middlewares/authSeller.js';

const orderRouter = express.Router();

// User routes (protected)
orderRouter.post('/place', authUser, placeOrder);
orderRouter.get('/my-orders', authUser, getMyOrders);

// Seller routes (protected)
orderRouter.get('/all', authSeller, getAllOrders);
orderRouter.post('/update-status/:id', authSeller, updateOrderStatus);

export default orderRouter;

