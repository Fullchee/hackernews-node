const { GraphQLServer } = require("./node_modules/graphql-yoga");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const crypto = require("crypto");
const { check, validationResult } = require("express-validator");
const express = require("express");
const bcrypt = require("bcrypt");

let links;
resetLinks();
function resetLinks() {
  links = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, "src", "links.json"))
  );
}

function randomFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateId() {
  return crypto.randomBytes(16).toString("hex");
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

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers
});

server.express.use(cors());
server.express.use(express.urlencoded({ extended: false }));
const OPTIONS = {
  port: process.env.PORT || 5000
};

server.express.set("json spaces", 2);

server.express.get("/links", function(req, res) {
  res.json(links);
});

server.express.get("/reset", function(req, res) {
  res.sendFile(path.resolve(__dirname, "src", "resetForm.html"));
});

server.express.post(
  "/reset",
  [check("resetPassword").isLength({ min: 3 })],
  (req, res) => {
    const password = req.body.resetPassword;

    // thisisunsafe, hashed with bcrypt
    const localResetPass =
      "$2b$10$MeF9iTg2/tOSyKJ8Y9Ht5uVH4DUV8Vc/wbhOpFjmTPrwxTBWwT3Oi";
    const resetPassword =
      process.env.SUPER_SECRET_RESET_PASSWORD || localResetPass;
    if (bcrypt.compareSync(password, resetPassword)) {
      resetLinks();
      res.send("Reset completed");
    } else {
      res.send("Incorrect password!");
    }
  }
);

server.start(OPTIONS, () =>
  console.log(`GraphQL Server is running on ${process.env.PORT || 5000}`)
);
