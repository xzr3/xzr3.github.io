const fs = require("fs");
const path = require("path");

// Read the keywords from the text file
const keywords = fs.readFileSync(path.join(__dirname, "keywords.txt"), "utf-8").split("\n");

// Randomly select 15 keywords
const selectedKeywords = [];
for (let i = 0; i < 20; i++) {
  const randomIndex = Math.floor(Math.random() * keywords.length);
  selectedKeywords.push(keywords[randomIndex]);
}

// Specify the relative paths to your HTML files
const htmlFiles = [
  path.join(__dirname, "../index.html"),
  path.join(__dirname, "../movies.html"),
  path.join(__dirname, "../series.html")
];

// Update the meta keywords in each HTML file
htmlFiles.forEach((htmlFilePath) => {
  let htmlContent = fs.readFileSync(htmlFilePath, "utf-8");
  htmlContent = htmlContent.replace(/<meta\s+name="keywords"\s+id="metaKeywords"\s+content="[^"]*"/, `<meta name="keywords" id="metaKeywords" content="${selectedKeywords.join(", ")}"`);
  fs.writeFileSync(htmlFilePath, htmlContent);
});

console.log("Meta keywords updated successfully for all files!");

//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

