const Meeting = require("../Models/meeting");
const ExpressError = require("../utilis/ExpressError");
const { StatusCodes } = require("http-status-codes");

const authMiddleWare = require("../middleware/authMiddleware");

module.exports.create = async (req,res)=> {
    const result = authMiddleWare(req,res);
    if(result.error){
        throw new ExpressError(StatusCodes.BAD_REQUEST,result.error.message);
    }
    console.log(result);
    const {user} = result;
    const newUser = await Meeting.create({
        host : user.user_id,
        participants: user.user_id
    });
    console.log(newUser);
    return newUser.user_id;
}