const fs = require("fs");
const path = require("path");
// added an id to every object
const links = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "..", "src", "links.json"))
);
function addIds() {
  let i = 0;
  links.forEach(link => {
    link.id = i++;
    return link;
    fs.writeFileSync("./links2.json", JSON.stringify(links));
  });
}
function addKeywords() {
  links.forEach(link => {
    if (!link.keywords) {
      link.keywords = [];
    }
  });
  fs.writeFileSync("./links2.json", JSON.stringify(links));
}

function getAllKeywords() {
  let keywords = links.reduce((acc, link) => {
    console.log(link);
    return [...acc, ...link.keywords];
  }, []);
  console.log(keywords);
}

// addKeywords();
getAllKeywords();
