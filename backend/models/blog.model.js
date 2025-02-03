import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    author: {
        type : mongoose.Schema.Types.ObjectId,
        reqyired: true,
        ref: 'User'
    },
    category: {
        type : mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Category'
    },
    title:{
        type: String,
        required: true,
        trim: true
    },
    slug:{
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    blogContent: {
        type: String,
        required: true,
        trim: true
    },
    featuredImage: {
        type: String,
        required: true,
        trim: true
    }
}, {timestamps: true})

const Blog = mongoose.model('Blog', blogSchema, 'blogs')
export default Blog