const { execFile } = require("child_process");
const fs = require("fs/promises");
const path = require("path");
const os = require("os");

async function scanCode(code) {
  const dir = await fs.mkdtemp(
    path.join(os.tmpdir(), "semgrep-")
  );

  const file = path.join(dir, "code.js");

  try {
    await fs.writeFile(file, code);

    return await new Promise((resolve, reject) => {
      execFile(
        "semgrep",
        ["scan", "--config", "auto", "--json", file],
        { timeout: 120000 },
        (error, stdout) => {
          // Semgrep may exit non-zero when scanning fails.
          // If JSON output exists, try to parse the findings.
          try {
            const result = JSON.parse(stdout);
            resolve(result.results);
          } catch {
            reject(error || new Error("Semgrep scan failed"));
          }
        }
      );
    });
  } finally {
    await fs.rm(dir, { recursive: true, force: true });
  }
}

module.exports = scanCode;
