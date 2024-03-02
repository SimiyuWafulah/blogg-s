import mongoose from 'mongoose'

const commentsSchema = new mongoose.Schema({
    content: {type: String, required: true},
    postId: {type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true},
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    likes:{type: Array, default:[]},
    numberOfLikes: {type: Number, default: 0},
},{timestamps: true})

const Comments = new mongoose.model('Comments', commentsSchema)

export default Comments