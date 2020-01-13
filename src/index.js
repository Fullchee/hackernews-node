const { GraphQLServer } = require("graphql-yoga");

// Schema
const typeDefs = `
type Query {
  info: String!
}
`;

// implementation of schema
const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`
  }
};

// 3
const server = new GraphQLServer({
  typeDefs,
  resolvers
});
server.start(() => console.log(`Server is running on http://localhost:4000`));
