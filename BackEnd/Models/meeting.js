const { string } = require("joi");
const mongoose = require("mongoose");

const meetingSchema = new mongoose.model({
    host : {
        Type : mongoose.Schema.Types.ObjectId,
        required : true
    }, 
    participants : {
        Type : mongoose.Schema.Types.Array.ObjectId,
        required : true
    },
    createdAt : {
        Type : String,
        requried : true
    }
});

const Meeting = mongoose.model("meeting",meetingSchema);
module.exports = Meeting;