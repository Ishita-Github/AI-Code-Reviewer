require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY});
const systemInstruction=require('../prompts/systeminstructions.prompt');
const reviewInstruction=require('../prompts/review.prompt')

const responseSchema={
    type: "object",
    properties: {
        summary: {
            type: "string"
        },
        score: {
            type: "integer"
        },
        issues: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    line: { type: "integer" },
                    severity: {
                        type: "string",
                        enum: ["critical", "high", "medium", "low"]
                    },
                    category: { type: "string" },
                    problem: { type: "string" },
                    fix: { type: "string" }
                },
                required: [
                    "line",
                    "severity",
                    "category",
                    "problem",
                    "fix"
                ]
            }
        }
    },
    required: ["summary", "score", "issues"]
};

async function generateResponse(code,language,onChunk) {
    const input = (language === "auto-detect")? code
        : `Language: ${language}\n\nCode:\n${code}`;

    const interaction = await ai.interactions.create({
        model: "gemini-3.8-flash",
        input: input,
        stream:true,
        system_instruction:
        `${systemInstruction}
         ${reviewInstruction.bugDetectionPrompt}
         ${reviewInstruction.securityAnalysisPrompt}
         ${reviewInstruction.codeQualityPrompt}
         ${reviewInstruction.verificationPrompt}`,
        
response_format: {
        type: "text",
        mime_type: "application/json",
        schema: responseSchema
    }

    });

    let fullResponse = "";

    for await(const event of interaction){
        if (event.event_type === "step.delta" && event.delta.type === "text") {
            fullResponse += event.delta.text;
            onChunk(event.delta.text);
        }
    }
    if(!fullResponse){
        throw new Error("AI returned an empty response")
    }
    return JSON.parse(fullResponse);
}

module.exports=generateResponse;

