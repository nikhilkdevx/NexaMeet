const joi = require("joi");

const validateMessage = joi.object({
    meetingId : joi.string().hex().length(24).required(),
    content : joi.string().trim().min(1).max(1000).required()
});

module.exports = validateMessage;