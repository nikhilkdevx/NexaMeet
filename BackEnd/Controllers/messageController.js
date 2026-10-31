const Message = require("../Models/chat");
const validateMessage = require("../Validators/validateMessage");
const ExpressError = require("../utilis/ExpressError");
const { StatusCodes } = require("http-status-codes");
const Meeting = require("../Models/meeting");

module.exports.Message = async(req,res) => {
    const result = validateMessage.validate(req.body);
    if(result.error){
        throw new ExpressError(StatusCodes.BAD_REQUEST,result.error.message);
    }

}