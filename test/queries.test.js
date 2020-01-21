const EasyGraphQLTester = require("easygraphql-tester");
const fs = require("fs");
const path = require("path");
const schemaCode = fs.readFileSync(
  path.join(__dirname, "..", "src", "schema.graphql"),
  "utf8"
);

describe("Test my queries", () => {
  let tester;

  beforeEach(() => {
    tester = new EasyGraphQLTester(schemaCode);
  });
  it("should get an id", () => {
    const query = `query {
    searchId(id: 0) {
      id
      title
      url
      takeaways
    }
  }`;
    tester.test(true, query);
  });
});
