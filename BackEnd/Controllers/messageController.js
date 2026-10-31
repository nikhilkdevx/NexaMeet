const Message = require("../Models/chat");
const validateMessage = require("../Validators/validateMessage");
const ExpressError = require("../utilis/ExpressError");
const { StatusCodes } = require("http-status-codes");
const Meeting = require("../Models/meeting");

module.exports.saveMessage = async(payload, senderId) => {
    const result = validateMessage.validate(payload);
    if(result.error){
        throw new ExpressError(StatusCodes.BAD_REQUEST,result.error.message);
    }
    const {meetingId , content } = payload;
    const meeting = await Meeting.findById(meetingId);
    if(!meeting){
        throw new ExpressError(StatusCodes.NOT_FOUND,"Meeting not Found");
    }
    const isSender =  meeting.participants.some((participant) => 
    participant.equals(senderId));
    if(!isSender) {
        throw new ExpressError(StatusCodes.FORBIDDEN,
            "You are not a Participant in this meeting"
        );
    }
}