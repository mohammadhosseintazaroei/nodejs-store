const { validationResult } = require("express-validator")
const { StatusCodes: HttpStatus } = require("http-status-codes");

const validationErrorMapper = (req, res, next) => {
    messages = {}
    const result = validationResult(req)
    if(result?.errors?.length > 0) {
        result?.errors.forEach(err => {
            messages[err.param] = err.msg;
        })
        return res.status(HttpStatus.BAD_REQUEST).json({
            status: HttpStatus.BAD_REQUEST,
            success: false, 
            messages
        })
    }
    next()
}

module.exports = {
    validationErrorMapper,
}
