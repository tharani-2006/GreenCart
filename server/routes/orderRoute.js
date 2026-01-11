import express from 'express';
import { placeOrderCOD, getUserOrders, getAllOrders } from '../controllers/orderController.js';
import authUser from '../middlewares/authUser.js';
import authSeller from '../middlewares/authSeller.js';

const orderRouter = express.Router();

// User routes (protected)
orderRouter.post('/cod', authUser, placeOrderCOD);
orderRouter.get('/user', authUser, getUserOrders);

// Seller routes (protected)
orderRouter.get('/seller', authSeller, getAllOrders);

export default orderRouter;
