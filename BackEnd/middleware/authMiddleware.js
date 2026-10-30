const ExpressError = require("../utilis/ExpressError");
const {StatusCodes} = require("http-status-codes");
const jwt = require("jsonwebtoken");
const authMiddleware = (req,res,next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader){
        throw new ExpressError(StatusCodes.UNAUTHORIZED,"Authentication Required");
    }
    const token = authHeader.split(" ")[1];
    
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECERT);
        req.user = decoded;
    } catch (err){
        throw new ExpressError(StatusCodes.UNAUTHORIZED,"Invalid or Expired token");
    }
    next();
};

module.exports = authMiddleware;

