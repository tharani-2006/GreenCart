import express from 'express';
import { addProduct, getAllProducts, getProductById, updateProduct, deleteProduct, updateProductStock } from '../controllers/productController.js';
import authSeller from '../middlewares/authSeller.js';
import multer from 'multer';

const productRouter = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Public routes
productRouter.get('/all', getAllProducts);
productRouter.get('/:id', getProductById);

// Seller routes (protected)
productRouter.post('/add', authSeller, upload.array('images', 4), addProduct);
productRouter.post('/update/:id', authSeller, upload.array('images', 4), updateProduct);
productRouter.delete('/delete/:id', authSeller, deleteProduct);
productRouter.post('/update-stock/:id', authSeller, updateProductStock);

export default productRouter;

