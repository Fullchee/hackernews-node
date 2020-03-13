const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

module.exports = class Links {
  constructor() {
    this.links = [];
    this.reset();
    this.ballets = 0;
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
    let i = 0;
    debugger;
    this.links = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, "links.json"))
    ).map(link => {
      link.keywords = link.keywords.map(keyword => {
        return {
          id: i++,
          label: keyword,
          value: keyword
        };
      });
      return link;
    });
  };

  getDaysSince = link => {
    if (!link.datesAccessed) {
      console.log(link);
    }
    if (!link.datesAccessed.length) {
      return 0;
    }
    const lastDate = new Date(
      link.datesAccessed[link.datesAccessed.length - 1]
    );
    return Math.floor((new Date() - lastDate) / (1000 * 60 * 60 * 24));
  };
  /**
   *
   */
  randomLink = () => {
    const link = this.links[Math.floor(Math.random() * this.links.length)];
    const dates = link.datesAccessed;
    if (!dates.length) {
      return link;
    }
    const daysSince = this.getDaysSince(link);
    if (daysSince > 300) {
      return link;
    }

    this.resetBalletCount();

    const threshold = Math.random() * this.ballets;
    let days = 0;
    for (let i = 0; i < this.links.length; i++) {
      if (days >= threshold) {
        return this.links[i];
      }
      days += this.getDaysSince(link);
    }
    debugger;
    link.keywords = JSON.stringify(link.keywords);
    return link;
  };
  resetBalletCount = () => {
    this.ballets = 0;
    this.links.forEach(link => {
      this.ballets += this.getDaysSince(link);
    });
  };
  generateId = () => {
    return crypto.randomBytes(16).toString("hex");
  };
};
