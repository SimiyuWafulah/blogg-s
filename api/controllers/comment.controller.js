import { errorHandler } from "../utils/error.js";
import Comments from "../models/comments.model.js";

export const createComment = async (req, res, next) => {
    try {
        const {content, postId, userId} = req.body;

        if(userId !== req.user.id) return next(errorHandler(403,'You cannot comment'))

        const newComment = new Comments({content, postId,userId})
        await newComment.save()
        res.status(200).json(newComment)
    } catch (error) {
        next(error)
    }
}