const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema({
    host : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    }, 
    participants : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
    }],
},{timestamps : true});

const Meeting = mongoose.model("meeting",meetingSchema);
module.exports = Meeting;