const { GraphQLServer } = require("graphql-yoga");

// implementation of schema
let links = [
  {
    id: "link-0",
    url: "www.howtographql.com",
    description: "Fullstack tutorial for GraphQL"
  }
];

let idCount = links.length;

const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    // 2
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
      //     const link = links.find(link => link === id);
      //   links.splice(
      //     links.findIndex(link => link === id),
      //     1
      //   );

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
