const { GraphQLServer } = require("./node_modules/graphql-yoga");
const fs = require("fs");
const path = require("path");
const express = require("express");

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
  port: process.env.PORT || 5000
};

server.express.use(express.static(path.join(__dirname, "client/build")));
server.express.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

server.start(OPTIONS, () =>
  console.log(`Server is running on ${process.env.PORT || 5000}`)
);
