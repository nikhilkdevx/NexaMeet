const { string } = require("joi");
const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema({
    host : {
        Type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    }, 
    participants : [{
        Type : mongoose.Schema.Types.ObjectId,
        ref : "User",
    }],
},{timestamps : true});

const Meeting = mongoose.model("meeting",meetingSchema);
module.exports = Meeting;