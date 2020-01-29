const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

module.exports = class Links {
  constructor() {
    this.links = [];
    this.reset();
    this.resolvers = {
      Query: {
        randomLink: () => this.randomLink(),
        searchId: (_, { id }) => {
          const a = this.links.find(link => link.id === id);
          return a;
        },
        links: () => this.links
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
          this.links.push(link);
          return link;
        },

        updateLink: (_, params) => {
          const updatedLink = JSON.parse(params.stringifiedLink);
          const index = this.links.findIndex(link => link.id == updatedLink.id);
          if (index === -1) {
            this.links.push(updatedLink);
          } else {
            this.links[index] = updatedLink;
          }
          return updatedLink;
        },

        updateLinkFields: (_, l) => {
          const index = this.links.findIndex(link => link.id == l.id);
          console.log(index);
          if (index === -1) {
            this.links.push(l);
          } else {
            this.links[index] = l;
          }
          return l;
        },
        deleteLink: (_, { id }) => {
          let deletedLink;

          this.links = this.links.filter(link => {
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
          for (let i = 0; i < this.links.length; i++) {
            for (key in this.links[i]) {
              if (this.links[i][key].indexOf(query) !== -1) {
                results.push(this.links[i]);
              }
            }
          }
          return results;
        }
      }
    };
  }

  reset = () => {
    this.links = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, "links.json"))
    );
  };
  randomLink = () => {
    return this.links[Math.floor(Math.random() * this.links.length)];
  };
  generateId = () => {
    return crypto.randomBytes(16).toString("hex");
  };
};
