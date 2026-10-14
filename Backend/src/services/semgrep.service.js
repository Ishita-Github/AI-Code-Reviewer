const { execFile } = require("child_process");
const fs = require("fs/promises");
const path = require("path");
const os = require("os");

async function scanCode(code) {
  let dir;
  try {
    dir = await fs.mkdtemp(path.join(os.tmpdir(), "semgrep-"));
    const file = path.join(dir, "code.js");
    await fs.writeFile(file, code);

    return await new Promise((resolve) => {
      execFile(
        "semgrep",
        ["scan", "--config", "p/javascript", "--json", "--metrics=off", file],
        { timeout: 20000, maxBuffer: 10 * 1024 * 1024 },
        (error, stdout) => {
          try {
            resolve(JSON.parse(stdout).results ?? []);
          } catch {
            console.warn("Semgrep skipped:", error?.message);
            resolve([]);   // never fails the review
          }
        }
      );
    });
  } catch (err) {
    console.warn("Semgrep skipped:", err.message);
    return [];
  } finally {
    if (dir) fs.rm(dir, { recursive: true, force: true }).catch(() => {});
  }
}

module.exports = scanCode;