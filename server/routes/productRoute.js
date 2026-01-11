import express from 'express';
import { addProduct, getAllProducts, getProductById, updateProduct, deleteProduct, updateProductStock } from '../controllers/productController.js';
import authSeller from '../middlewares/authSeller.js';
import { upload } from '../configs/multer.js';

const productRouter = express.Router();

// Public routes
productRouter.get('/all', getAllProducts);
productRouter.get('/:id', getProductById);

// Seller routes (protected)
productRouter.post('/add', upload.array('images', 4), authSeller, addProduct);
productRouter.post('/update/:id', upload.array('images', 4), authSeller, updateProduct);
productRouter.delete('/delete/:id', authSeller, deleteProduct);
productRouter.post('/update-stock/:id', authSeller, updateProductStock);

export default productRouter;

