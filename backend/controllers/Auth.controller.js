import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs'
import { handleError } from "../helpers/handleError.js"
import jwt from 'jsonwebtoken'


export const Register = async (req, res, next)=> {
    try {
        const {name, email, password} = req.body;//fetch data 
        const checkUser = await User.findOne({email})
        if(checkUser){
            //user already registered
            next(handleError(409, 'User already registered'))
        }
        //register user

        //1st : hash password
        const  hashedPassword = bcryptjs.hashSync(password)

        //now create entry
        const user = new User({
            name, email, password: hashedPassword
        })

        await user.save();//save at db

        res.status(200).json({
            success: true,
            message: 'User successfully registered !'
        })

    } catch (error) {
        next(handleError(500, error.message))
    }
}


export const Login = async (req, res, next) => {
  try {

    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return next(handleError(404, "Invalid Login Credentials!"));
    }

    // Compare password
    const hashedPassword = user.password;
    const isPasswordValid = await bcryptjs.compare(password, hashedPassword);
    if (!isPasswordValid) {
      return next(handleError(404, "Invalid Login Credentials!"));
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role
      },
      process.env.JWT_SECRET
    );

    // Set session cookie
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      path: "/",
    });

    // Prepare user object to send back
    const newUser = user.toObject({ getters: true });
    delete newUser.password;

    res.status(200).json({
      success: true,
      user: newUser,
      message: "Login successful!",
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};



  export const GoogleLogin = async (req, res, next) => {
    try {
      const { name, email, avatar } = req.body;
      // Log the request body to see the incoming data
      
      let user 
      user = await User.findOne({ email });
      
      if (!user) {
        //agar user nahi milta hai to user create krenge or us se pehle ek random password generate krke store kara lenge
        const password =Math.random().toString()// ek aisehi random password generate kr rhe hai
        const hashedPassword = bcryptjs.hashSync(password)
        const newUser = new User({
          name, email, password: hashedPassword, avatar
        })
        user = await newUser.save()
      }

     
      // now user is valid create token
      const token = jwt.sign(
        {
          _id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          role:user.role
        },
        process.env.JWT_SECRET)
      
  
      //session based login system
      res.cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        path: '/'
      });
  
      const newUser = user.toObject({ getters: true });
      delete newUser.password;
  
      res.status(200).json({
        success: true,
        user : newUser,
        message: "Login successfull!",
      });
    } catch (error) {
      next(handleError(500, error.message));
    }
  };
  

  export const Logout = async (req, res, next) => {
    try {

        res.clearCookie('access_token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            path: '/'
        })

        res.status(200).json({
            success: true,
            message: 'Logout successfully !.'
        })

    } catch (error) {
        next(handleError(500, error.message))
    }
}