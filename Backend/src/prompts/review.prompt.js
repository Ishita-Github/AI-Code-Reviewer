const bugDetectionPrompt = `
Identify logical errors, runtime errors,
incorrect conditions, and edge cases.
Report only issues supported by the code.
Explain each bug and suggest a practical fix.
`;

const securityAnalysisPrompt = `
Identify potential security vulnerabilities,
unsafe input handling, injection risks,
exposed secrets, and authentication weaknesses.
Explain the risk and suggest a secure fix.
`;

const codeQualityPrompt = `
Review readability, maintainability, duplication,
unnecessary complexity, and inefficient operations.
Suggest meaningful improvements without
changing correct behavior.
`;

const verificationPrompt = `
Verify findings against the original code.
Remove duplicates and unsupported claims.
Check line numbers and severity.
Do not invent issues or claim code was tested
without execution evidence.
`;

module.exports = {
    bugDetectionPrompt,
    securityAnalysisPrompt,
    codeQualityPrompt,
    verificationPrompt
};
