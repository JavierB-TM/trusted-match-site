const fs = require("fs");

const fileA = process.argv[2];
const fileB = process.argv[3];

if (!fileA || !fileB) {
  console.error("❌ Veuillez fournir deux fichiers à comparer.");
  process.exit(1);
}

const hashA = fs.readFileSync(fileA, "utf8").split("\n").filter(Boolean);
const hashB = fs.readFileSync(fileB, "utf8").split("\n").filter(Boolean);

const intersection = hashA.filter((line) => hashB.includes(line));

console.log(`📊 Résultat du matching :`);
console.log(`- Lignes communes : ${intersection.length}`);
console.log(`- Total fichier A : ${hashA.length}`);
console.log(`- Total fichier B : ${hashB.length}`);

const outputPath = "match-result.txt";
fs.writeFileSync(outputPath, intersection.join("\n"), "utf8");
console.log(`✅ Résultat enregistré dans : ${outputPath}`);

