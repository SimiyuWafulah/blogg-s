import express from 'express'
import mongoose from 'mongoose';
import userRoute from './routes/user.route.js'
import authRoute from './routes/auth.route.js'
import dotenv from 'dotenv';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import { errorMiddleware } from './middlewares/error.middleware.js';
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(cookieParser());

const PORT = process.env.PORT

mongoose.connect(process.env.MONGO).then(() => {
    console.log('Connected to Database')
}).catch((err) => {
    console.log(err)
})

app.listen(PORT, () => {
    console.log('Server is Running')
});

app.use('/api/user', userRoute);
app.use('/api/auth', authRoute);

app.use(errorMiddleware);