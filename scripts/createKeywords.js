const fs = require("fs");
const path = require("path");
let i = 0;
const keywords = fs
  .readFileSync(path.resolve(__dirname, "keywords.txt"), "utf-8")
  .split("\n")
  .slice(0, -1) // remove the last line at the end
  .map(word => {
    return {
      id: i++,
      label: word,
      value: word
    };
  });

fs.writeFileSync(
  path.resolve(__dirname, "..", "src", "keywords.json"),
  JSON.stringify(keywords)
);
