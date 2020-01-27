const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

let links;
module.exports.resetLinks = function resetLinks() {
  links = JSON.parse(fs.readFileSync(path.resolve(__dirname, "links.json")));
};

function randomFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateId() {
  return crypto.randomBytes(16).toString("hex");
}

module.exports.resolvers = {
  Query: {
    randomLink: () => randomFromArray(links),
    searchId: (_, { id }) => {
      const a = links.find(link => link.id === id);
      return a;
    },
    links: () => links
  },
  Mutation: {
    addLink: (parent, args) => {
      const link = {
        id: `${generateId()}`,
        title: args.title | "",
        takeaways: args.takeaways || "",
        url: args.url || "",
        categories: args.categories || [],
        datesAccessed: args.datesAccessed || []
      };

      // TODO: look for duplicates
      links.push(link);
      return link;
    },
    updateLink: (_, l) => {
      const index = links.findIndex(link => link.id === l.id);
      if (!index) {
        links.push(l);
      } else {
        links[index] = l;
      }
      return l;
    },
    deleteLink: (_, { id }) => {
      let deletedLink;

      links = links.filter(link => {
        if (link.id === id) {
          deletedLink = link;
          return false;
        }
        return true;
      });
      return deletedLink;
    },
    searchAll: (_, { query }) => {
      let results = [];
      for (let i = 0; i < links.length; i++) {
        for (key in links[i]) {
          if (links[i][key].indexOf(query) !== -1) {
            results.push(links[i]);
          }
        }
      }
      return results;
    }
  }
};

module.exports.getLinks = () => {
  return links;
};
