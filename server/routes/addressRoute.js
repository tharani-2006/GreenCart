import express from 'express';
import { addAddress, getAddresses, updateAddress, deleteAddress } from '../controllers/addressController.js';
import authUser from '../middlewares/authUser.js';

const addressRouter = express.Router();

// All address routes are protected
addressRouter.post('/add', authUser, addAddress);
addressRouter.get('/get', authUser, getAddresses);
addressRouter.post('/update/:id', authUser, updateAddress);
addressRouter.delete('/delete/:id', authUser, deleteAddress);

export default addressRouter;

