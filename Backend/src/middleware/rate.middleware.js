const ratelimit=require('express-rate-limit');

const aiRateLimit= ratelimit({
    windowMs:60*1000,
    limit:3,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
        status: "Failed",
        message: "Too many requests. Please try again later."
    }
});

module.exports = aiRateLimit;