import express from 'express'
import mongoose from 'mongoose';
import userRoute from './routes/user.route.js'
import dotenv from 'dotenv';
dotenv.config();

const app = express();

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