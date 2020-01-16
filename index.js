const { GraphQLServer } = require("./node_modules/graphql-yoga");
const fs = require("fs");
const path = require("path");

let links = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "src", "links.json"))
);

let idCount = links.length;

function randomFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const resolvers = {
  Query: {
    randomLink: () => randomFromArray(links)
  },
  Mutation: {
    // 2
    post: (parent, args) => {
      const link = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url
      };
      links.push(link);
      return link;
    },
    updateLink: (_, { id, url, description }) => {
      const index = links.findIndex(link => link.id === id);
      const link = links.find(link => link.id === id);
      url && (link.url = url);
      description && (link.description = description);
      links[index] = link;
      return link;
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
    }
  }
};

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers
});
const OPTIONS = {
  port: process.env.PORT || 4000
};
server.start(OPTIONS, () =>
  console.log(`Server is running on http://localhost:4000`)
);
