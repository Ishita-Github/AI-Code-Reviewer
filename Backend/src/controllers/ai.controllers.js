const aiService = require("../services/ai.service");
const scanCode = require("../services/semgrep.service");

async function getReview(req, res) {
    const code = req.body.code;

    if (!code || !code.trim() || typeof code !== "string" ) {
        return res.status(400).json({
            status:"Failed",
            message:"Code is required"
        });
    }

    if (code.length > 10000){
        return res.status(400).json({
            message:"Code must not exceed 10,000 characters"
        })
    }
    try {
    //const semgrepResults = await scanCode(code);
    const allowedLanguages=["javascript", "typescript", "python", "java", "c", "cpp", "go"];
    const language=allowedLanguages.includes(req.body?.language)? req.body.language: "auto-detect";
    
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders();

    console.time("semgrep");
    console.timeEnd("semgrep");
    console.time("first-chunk");
    let first="true"
    const response = await aiService(code,language,(chunk) => {
        if (first) { console.timeEnd("first-chunk"); first = false; }
        res.write(chunk);
    });

    res.end()
    } catch (error) {
        console.error("Review error:", error);
        if (!res.headersSent) {
        return res.status(500).json({
            status:"Review Failed",
            message: error.message
        });
    }
    res.end();
}
}

module.exports = {
    getReview
};