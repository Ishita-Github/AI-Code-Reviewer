const aiService = require("../services/ai.service");

async function getReview(req, res,next) {
    const code = req.body.code;

    if (!code || !code.trim()) {
        return res.status(400).send("Code is required");
    }
    try {
    const response = await aiService(code);
    res.json({
        success: true,
        review: response
    });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getReview
};