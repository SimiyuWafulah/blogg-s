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

export const getComments = async (req, res, next) => {
    try {
        const comments = await Comments.find({
          postId: req.params.postId
        }).sort({createdAt : -1})
        res.status(200).json(comments)
    } catch (error) {
        next(error)
    }
}
export const likeComment = async (req, res, next) => {
    try {
        const comment = await Comments.findById(req.params.commentId);
        if (!comment) return next(errorHandler(404, 'Comment not found'));

        const userIndex = comment.likes.indexOf(req.user.id);

        if (userIndex !== -1) {
            // User already liked the comment, so remove the like
            comment.numberOfLikes -= 1;
            comment.likes.splice(userIndex, 1);
        } else {
            // User hasn't liked the comment yet, so add the like
            comment.numberOfLikes += 1;
            comment.likes.push(req.user.id);
        }

        await comment.save();
        res.status(200).json(comment);
    } catch (error) {
        next(error);
    }
};
