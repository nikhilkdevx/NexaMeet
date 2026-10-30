const joi = require("joi");

const validateRegisteration = joi.object({
    name : joi.string().min(3).max(30).required(),
    email:joi.string().email().required(),
    password:joi.string().min(6).required()
});

module.exports = validateRegisteration;