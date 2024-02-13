import User from '../models/user.model.js'
import bcryptjs from 'bcryptjs'
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken'

export const signup = async (req, res, next) => {
    try {
        const {username, email, password} = req.body;
        //check if user exists
        const existingUser = await User.findOne({$or : [{email}, {username}]})
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

export const signin = async (req, res, next) => {
    const {email, password} = req.body;
    if (!email || !password || email===" " || password=== " ") {
        return next(errorHandler(401, 'All fields are required'))
   }
    try {
        //verify user email
        const validUser = await User.findOne({email});
        if(!validUser) return next(errorHandler(404, 'User not found'));
        //verify password
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if(!validPassword) return next(errorHandler(404,'Incorrect email or password'));
        const token = jwt.sign({id: validUser._id}, process.env.JWT)
        const {password: pass, ...rest} = validUser._doc
        res
        .cookie('access_token', token, {httpOnly: true})
        .status(200)
        .json(rest)
    } catch (error) {
        next(error)
    }
}

export const google = async (req, res, next) => {
    const {name, email, photoURL} = req.body
   try {
    const user = await User.findOne({email});
    if(user) {
        const token = jwt.sign({id: user._id}, process.env.JWT);
        const {password : pass, ...rest} = user._doc
        res.cookie('access_token', token, {httpOnly : true}).status(200).json(rest)
    }else {
        const generatePassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)
        const hashGeneratePassword = await bcryptjs.hash(generatePassword,10)
        const newUser = new User({username : name.toLowerCase().split(' ').join('') + Math.random().toString(36).slice(-4), email, password: hashGeneratePassword, profilePic: photoURL});
        await newUser.save();
        const token = jwt.sign({id: newUser._id}, process.env.JWT)
        const {password: pass, ...rest} = newUser._doc
        res.cookie('access_token', token, {httpOnly: true}).status(201).json(rest)
    }
   } catch (error) {
    next(error)
   }
}
