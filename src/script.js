const fs = require("fs");

const links = JSON.parse(fs.readFileSync("./links.json"));
let i = 0;
links.forEach(link => {
  link.id = i++;
  return link;
});

fs.writeFileSync("./links2.json", JSON.stringify(links));
