import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import cors from 'cors'
import mongoose from 'mongoose';
import AuthRoute from './routes/Auth.route.js';
import UserRoute from './routes/User.route.js';
import CategoryRoute from './routes/Category.route.js';
import BlogRoute from './routes/Blog.route.js';
import CommentRoute from './routes/Comment.route.js';
import BlogLikeRoute from './routes/Bloglike.route.js';
import { getAllBlogs } from './controllers/Blog.controller.js';


dotenv.config();
const PORT = process.env.PORT


const app = express();

//jab hum frontend se api request karenge to api ke sath cokkie v send ho backend me, us cookie se data nikal ke hume do
app.use(cookieParser())
//api call se json data ko send kar sdake or backend me json format me read kar sake
app.use(express.json())
//different domain ke beech me connection establish krne ke liye
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))


//route setup
app.use('/api/auth', AuthRoute)
app.use('/api/user', UserRoute)
app.use('/api/category', CategoryRoute)
app.use('/api/blog', BlogRoute)
app.use('/api/comment',CommentRoute)
app.use('/api/blog-like',BlogLikeRoute)




//for DB connection
mongoose.connect(process.env.MONGODB_CONN, {dbName:'harsh-blog'})
.then(()=> console.log('DB is connected!'))
.catch(err => console.log('Database connection failed!', err))

//start the server
app.listen(PORT, ()=> {
    console.log(`server running on PORT no ${PORT}`);
})

//middleware for handling error
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || 'Internal server error'
    res.status(statusCode).json({
        success:false,
        statusCode,
        message
    })
})