const { GraphQLServer } = require("./node_modules/graphql-yoga");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

let links = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "src", "links.json"))
);

let idCount = links.length;

function randomFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const resolvers = {
  Query: {
    randomLink: () => randomFromArray(links),
    searchId: (_, { id }) => {
      const a = links.find(link => link.id === id);
      return a;
    },
    links: () => links
  },
  Mutation: {
    // 2
    addLink: (parent, args) => {
      const link = {
        id: `${idCount++}`,
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
      links[index] = l;
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

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers
});

server.express.use(cors());
const OPTIONS = {
  port: process.env.PORT || 5000
};

server.start(OPTIONS, () =>
  console.log(`GraphQL Server is running on ${process.env.PORT || 5000}`)
);
