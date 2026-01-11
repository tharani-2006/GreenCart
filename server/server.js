import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import connectDB from './configs/db.js';
import dotenv from 'dotenv';
import userRouter from './routes/userRoute.js';
import sellerRouter from './routes/sellerRoute.js';
import productRouter from './routes/productRoute.js';
import orderRouter from './routes/orderRoute.js';
import addressRouter from './routes/addressRoute.js';
import cartRouter from './routes/cartRoute.js';
import connectCloudinary from './configs/cloudinary.js';

dotenv.config(); 

const app = express();
const port = process.env.PORT || 4000

//connect to db
await connectDB()
await connectCloudinary

//Allow mulitple origins
const allowedOrigins = ['http://localhost:5173']

//Middleware Configuration
app.use(express.json());
app.use(cookieParser())
app.use(cors({origin: allowedOrigins, credentials: true}))

app.get('/', (req, res) => res.send("Api running"))
app.use('/api/user', userRouter)
app.use('/api/seller', sellerRouter)
app.use('/api/product', productRouter)
app.use('/api/order', orderRouter)
app.use('/api/address', addressRouter)
app.use('/api/cart', cartRouter)

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})