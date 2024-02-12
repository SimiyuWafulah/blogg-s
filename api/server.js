import express from 'express'
import mongoose from 'mongoose';
import userRoute from './routes/user.route.js'
import authRoute from './routes/auth.route.js'
import dotenv from 'dotenv';
import { errorMiddleware } from './middlewares/error.middleware.js';
dotenv.config();

const app = express();

app.use(express.json())

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