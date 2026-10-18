/**
 * Simple smoke tests for the calculator app.
 * Uses only Node's built-in 'assert' — no extra dependencies needed.
 */
const assert = require("assert");
const path   = require("path");
const fs     = require("fs");

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✔  ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✘  ${name}`);
    console.error(`     ${err.message}`);
    failed++;
  }
}

console.log("\n── Calculator App Tests ──\n");

// 1. app.js exists
test("app.js exists", () => {
  const appPath = path.join(__dirname, "..", "app.js");
  assert.ok(fs.existsSync(appPath), "app.js not found");
});

// 2. app.js exports / starts an Express app
test("app.js loads without errors", () => {
  // Just require it — if it throws, the test fails
  // We override listen so no port is actually opened
  const http = require("http");
  const original = http.Server.prototype.listen;
  http.Server.prototype.listen = function () { return this; };
  delete require.cache[require.resolve("../app.js")];
  require("../app.js");
  http.Server.prototype.listen = original;
});

// 3. public/index.html exists
test("public/index.html exists", () => {
  const htmlPath = path.join(__dirname, "..", "public", "index.html");
  assert.ok(fs.existsSync(htmlPath), "public/index.html not found");
});

// 4. index.html contains calculator markup
test("index.html contains calculator UI elements", () => {
  const html = fs.readFileSync(
    path.join(__dirname, "..", "public", "index.html"),
    "utf8"
  );
  assert.ok(html.includes("calculator"), 'Missing class "calculator"');
  assert.ok(html.includes("display"),    'Missing class "display"');
  assert.ok(html.includes("calculate()"), 'Missing calculate() function');
});

// 5. package.json has a start script
test("package.json has a start script", () => {
  const pkg = JSON.parse(
    fs.readFileSync(path.join(__dirname, "..", "package.json"), "utf8")
  );
  assert.ok(pkg.scripts && pkg.scripts.start, "No start script defined");
});

// ── Summary ──────────────────────────────────────────────────
console.log(`\n── Results: ${passed} passed, ${failed} failed ──\n`);

if (failed > 0) process.exit(1);
