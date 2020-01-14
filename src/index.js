const { GraphQLServer } = require("graphql-yoga");
const fs = require("fs");

fs.readFileSync;
let links = [
  {
    id: "link-0",
    url: "www.howtographql.com",
    description: "Fullstack tutorial for GraphQL"
  }
];

let idCount = links.length;

function randomFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const resolvers = {
  Query: {
    randomLink: () => randomFromArray(links),
    feed: () => links
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

// 3
const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers
});
server.start(() => console.log(`Server is running on http://localhost:4000`));
