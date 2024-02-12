import User from '../models/user.model.js'
import bcryptjs from 'bcryptjs'

export const signup = async (req, res) => {
    try {
        const {username, email, password} = req.body;
        if(! username || email || password || username==='' || email==='' || password==='') {
            return res.status(400).json({ message : 'All fileds are required'})
        }
        //check if user exists
        const existingUser = await User.findOne({$or : [{email, password}]})
        if(existingUser) return res.status(401).json({messsage:'Account already exists'});
        //register new user
        const hashPassword = await bcryptjs.hash(password, 10);
        const newUser = User({username, email, password: hashPassword});
        await newUser.save();
        res
        .status(201)
        .json({message: 'Account created Successfuly'});
    } catch (error) {
        console.log(error)
    }
}