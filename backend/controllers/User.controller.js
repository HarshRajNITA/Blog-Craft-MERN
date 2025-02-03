
import { handleError } from "../helpers/handleError.js";
import User from "../models/user.model.js";
import Blog from "../models/blog.model.js"
import Comment from "../models/comment.model.js"
import mongoose from "mongoose";
import bcryptjs from 'bcryptjs'
import cloudinary from "../config/cloudinary.js"
import BlogLike from "../models/bloglike.model.js";

export const getUser = async (req, res, next) => {
    try {
        const { userid } = req.params;

        // Validate that the provided userid is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(userid)) {
            return next(handleError(400, "Invalid user ID!"));
        }

        // Query the database using MongoDB's default _id field
        const user = await User.findById(userid).exec();

        if (!user) {
            // If no user is found, handle the error gracefully
            return next(handleError(404, "User not found!"));
        }

        // Respond with the user data
        res.status(200).json({
            success: true,
            message: "User data found",
            user,
        });
    } catch (error) {
        // Handle any unexpected errors
        next(handleError(500, error.message));
    }
};

export const updateUser = async (req, res, next) => {
    try {
       const data = JSON.parse(req.body.data)
        const {userid} = req.params
        const user = await User.findById(userid)
        user.name = data.name
        user.email = data.email
        user.bio = data.bio

        if(data.password && data.password.length >= 8){
            const hashedPasssword = bcryptjs.hashSync(data.password)
            user.password = hashedPasssword
        }
        if(req.file){
             // Upload an image
     const uploadResult = await cloudinary.uploader
     .upload(
        req.file.path,
        {folder: 'blog-mern-harsh', resource_type: 'auto'}
     )
     .catch((error) => {
        next(handleError(500, error.message))
     });
     user.avatar = uploadResult.secure_url
        }
        await user.save()
        const newUser = user.toObject({ getters: true });
        delete newUser.password;
       res.status(200).json({
        success: true,
        message: "data updated",
        user: newUser
    });
    } catch (error) {
        // Handle any unexpected errors
        next(handleError(500, error.message));
    }
}

export const getAllUser = async (req, res, next) => {
    try {
        const user = await User.find().sort({ createdAt: -1 })
        res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        next(handleError(500, error.message))
    }
}
export const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params
        // const user = await User.findByIdAndDelete(id)
        await Comment.deleteMany({ user: id });// delete user along with comment and bllg
        await Blog.deleteMany({ author: id });
        await BlogLike.deleteMany({author: id})
        await User.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: 'Data deleted.'
        })
    } catch (error) {
        next(handleError(500, error.message))
    }
}


