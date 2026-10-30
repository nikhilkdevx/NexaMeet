const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    meetingId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Meeting",
        required : true
    },
    sender : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    content : {
        type : String,
        required : true,
        trim : true
    }
},{timestamps : true});

const Message = mongoose.model("message",messageSchema);
module.exports = Message;