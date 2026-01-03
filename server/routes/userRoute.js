import express from 'express';
import { register, login, isAuth, logout, addToCart, removeFromCart, updateCart, getCart } from '../controllers/userController.js';
import authUser from '../middlewares/authUser.js';

const userRouter = express.Router();

userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.get('/is-auth', authUser, isAuth);
userRouter.post('/logout', logout);

// Cart routes (protected)
userRouter.post('/add-to-cart', authUser, addToCart);
userRouter.post('/remove-from-cart', authUser, removeFromCart);
userRouter.post('/update-cart', authUser, updateCart);
userRouter.get('/get-cart', authUser, getCart);

export default userRouter;