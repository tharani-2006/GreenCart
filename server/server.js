import cookieParser from 'cookie-parser';
import express from 'express'
import cors from 'cors';
import connectDB from './configs/db.js';
import dotenv from 'dotenv';
import userRouter from './routes/userRoute.js';

dotenv.config(); 

const app = express();
const port = process.env.PORT || 4000

await connectDB()

//Allow mulitple origins
const allowedOrigins = ['http://localhost:5173']

//Middleware Configuration
app.use(express.json());
app.use(cookieParser())
app.use(cors({origin: allowedOrigins, credentials: true}))

app.get('/', (req, res) => res.send("Api running"))
app.use('/api/user', userRouter)

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})