const fs = require("fs");
const path = require("path");

// Read the keywords from the text file
const keywords = fs.readFileSync(path.join(__dirname, "keywords.txt"), "utf-8").split("\n");

// Specify the relative paths to your HTML files
const htmlFiles = [
  path.join(__dirname, "../index.html"),
  path.join(__dirname, "../movies.html"),
  path.join(__dirname, "../series.html")
];

// Function to select random keywords
function selectRandomKeywords(numKeywords) {
  const selectedKeywords = [];
  for (let i = 0; i < numKeywords; i++) {
    const randomIndex = Math.floor(Math.random() * keywords.length);
    selectedKeywords.push(keywords[randomIndex]);
  }
  return selectedKeywords;
}

// Update the meta keywords in each HTML file
htmlFiles.forEach((htmlFilePath) => {
  const numKeywords = 20; // Set the desired number of keywords here
  const selectedKeywords = selectRandomKeywords(numKeywords);

  let htmlContent = fs.readFileSync(htmlFilePath, "utf-8");
  htmlContent = htmlContent.replace(/<meta\s+name="keywords"\s+id="metaKeywords"\s+content="[^"]*"/, `<meta name="keywords" id="metaKeywords" content="${selectedKeywords.join(", ")}"`);
  fs.writeFileSync(htmlFilePath, htmlContent);

  console.log(`Meta keywords updated successfully for ${htmlFilePath}!`);
});

console.log("Meta keywords updated successfully for all files!");


