const Meeting = require("../Models/meeting");
const ExpressError = require("../utilis/ExpressError");
const { StatusCodes } = require("http-status-codes");

module.exports.create = async (req,res)=> {
    const newMeeting = await Meeting.create({
        host : req.user.userId,
        participants: [host]
    });
    console.log(newMeeting);
    res.status(StatusCodes.CREATED).json(newMeeting);
}