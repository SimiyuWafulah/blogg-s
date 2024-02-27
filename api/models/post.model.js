import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    userId : {type:String, required: true},
    content : {type: String, required: true},
    title : {type:String, required: true, unique: true},
    image : {type: String, default: "https://png.pngtree.com/png-clipart/20220217/ourmid/pngtree-new-post-icon-giphy-instagram-png-image_4393115.png"},
    category : {type: String, default: 'uncategorized'},
    slug : {type: String, unique: true, required: true}
},{timestamps: true})

const Post = new mongoose.model('Post', postSchema);

export default Post