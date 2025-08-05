const fs = require("fs");
const crypto = require("crypto");
const path = require("path");

const inputPath = process.argv[2];
if (!inputPath) {
  console.error("❌ Veuillez fournir un fichier CSV à hasher.");
  process.exit(1);
}

const content = fs.readFileSync(inputPath, "utf8");
const lines = content.split("\n").map((line) => line.trim()).filter(Boolean);

const hashedLines = lines.map((line) =>
  crypto.createHash("sha256").update(line).digest("hex")
);

const outputPath = inputPath.replace(/\.csv$/, ".hashed.csv");
fs.writeFileSync(outputPath, hashedLines.join("\n"), "utf8");

console.log(`✅ Fichier hashé généré : ${outputPath}`);

