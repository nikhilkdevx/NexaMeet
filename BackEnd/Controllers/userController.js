const validateRegisteration = require("../Validators/validateRegisteration");
const validateLogin = require("../Validators/validateLogin");
const User = require("../Models/user");
const ExpressError = require("../utilis/ExpressError");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

module.exports.register = async (req,res)=>{
    const result = validateRegisteration.validate(req.body);
    if(result.error){
        throw new ExpressError(StatusCodes.BAD_REQUEST,result.error.message);
    }
    const {name,email,password} = req.body;
    const existingUser = await User.findOne({ email });
    if(existingUser){
        throw new ExpressError(StatusCodes.CONFLICT,"Email Already Exist");
    }
    const hashedPass = await bcrypt.hash(password,10);
    const user = new User({
        name,
        email,
        password : hashedPass
    });
    await user.save();
    const safeUser = {
        name,
        email
    };
    return res.status(StatusCodes.CREATED).json({message : "User Registered",safeUser});
};

module.exports.login = async (req,res)=>{
    const result = validateLogin.validate(req.body);
    if(result.error){
        throw new ExpressError(StatusCodes.BAD_REQUEST,result.error.message);
    }
    const {email,password} = req.body;
    const user = await User.findOne({email});
    if(!user){
        throw new ExpressError(StatusCodes.UNAUTHORIZED,"Invalid Email or Password");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        throw new ExpressError(StatusCodes.UNAUTHORIZED,"Invalid Email or Password");
    }
    const token = jwt.sign(
        { userId : user._id},
        process.env.JWT_SECERT,
        {expiresIn : "7d"}
    );
    const safeUser = {
        id : user._id,
        name : user.name,
        email: user.email
    };
    res.status(StatusCodes.OK).json({message : "Login Success" , token , user : safeUser});
};