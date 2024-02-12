import User from '../models/user.model.js'
import bcryptjs from 'bcryptjs'
import { errorHandler } from '../utils/error.js';

export const signup = async (req, res, next) => {
    try {
        const {username, email, password} = req.body;
        if(! username || email || password || username==='' || email==='' || password==='') {
            return next(errorHandler(401, 'All fields are required'))
        }
        //check if user exists
        const existingUser = await User.findOne({$or : [{email, password}]})
        if(existingUser) return next(errorHandler(409, 'Account already exists'))
        //register new user
        const hashPassword = await bcryptjs.hash(password, 10);
        const newUser = User({username, email, password: hashPassword});
        await newUser.save();
        res
        .status(201)
        .json({message: 'Account created Successfuly'});
    } catch (error) {
        next(error)
    }
}