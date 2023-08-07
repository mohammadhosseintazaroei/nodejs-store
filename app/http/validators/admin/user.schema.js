const Joi = require("@hapi/joi");
const { MongoIDPattern, MobilePattern, EmailPattern, UsernamePattern } = require("../../../utils/constants");
const createError = require("http-errors");

const CreateUserSchema = Joi.object({
    first_name : Joi.string().min(3).max(32).error(createError.BadRequest("the first name can't exceed 32 characters")),
    last_name: Joi.string().min(3).max(32).error(createError.BadRequest("the last name can't exceed 32 characters")),
    username: Joi.string().pattern(UsernamePattern).error(createError.BadRequest("username is not valid")),
    mobile: Joi.string().pattern(MobilePattern).error(createError.BadRequest("mobile number is not valid")),
    email: Joi.string().pattern(EmailPattern).error(createError.BadRequest("email is not valid")),
    fileName: Joi.string().pattern(/(\.png|\.jpg|\.webp|\.jpeg)$/).error(createError.BadRequest("File type is not correct 🗿 send .png/.jpg/.jpeg/.webp")),
    fileUploadPath : Joi.allow(),
    image : Joi.allow()
})

module.exports = {
    CreateUserSchema,
}
