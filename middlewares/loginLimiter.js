const rateLimit = require('express-rate-limit');


const loginLimiter = rateLimit({
    windowMs: 24 * 60 *60 * 1000,
    max: 10,
    message: {message: 'Too many login attempts from this IP'},
    handler: (req, res, next, option) => {
        console.log("One IP limited")
        res.status(option.statusCode).send(option.message)
    },
    standardHeaders: true,
    legacyHeaders: false,
})

module.exports = loginLimiter