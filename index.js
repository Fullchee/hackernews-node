const { GraphQLServer } = require("./node_modules/graphql-yoga");
const path = require("path");
const cors = require("cors");
const { check } = require("express-validator");
const express = require("express");
const bcrypt = require("bcrypt");
const Links = require("./src/Links");
const links = new Links();

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers: links.resolvers
});

server.express.use(cors());
server.express.use(express.urlencoded({ extended: false }));
const OPTIONS = {
  port: process.env.PORT || 5000
};

server.express.set("json spaces", 2);

server.express.get("/links", function(req, res) {
  res.json(links.getLinks());
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
      links.reset();
      res.send("Reset completed");
    } else {
      res.send("Incorrect password!");
    }
  }
);

server.start(OPTIONS, () => {
  console.log(`GraphQL Server is running on ${process.env.PORT || 5000}`);
});
