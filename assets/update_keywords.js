const fs = require("fs");
const path = require("path");

// Read the keywords from the text file
const keywords = fs.readFileSync(path.join(__dirname, "keywords.txt"), "utf-8").split("\n");

// Randomly select 15 keywords
const selectedKeywords = [];
for (let i = 0; i < 15; i++) {
  const randomIndex = Math.floor(Math.random() * keywords.length);
  selectedKeywords.push(keywords[randomIndex]);
}

// Specify the relative path to your HTML file
const htmlFilePath = path.join(__dirname, "../index.html");

// Update the meta keywords in the HTML file
let htmlContent = fs.readFileSync(htmlFilePath, "utf-8");
htmlContent = htmlContent.replace(/<meta\s+name="keywords"\s+id="metaKeywords"\s+content="[^"]*"/, `<meta name="keywords" id="metaKeywords" content="${selectedKeywords.join(", ")}"`);
fs.writeFileSync(htmlFilePath, htmlContent);

console.log("Meta keywords updated successfully!");
