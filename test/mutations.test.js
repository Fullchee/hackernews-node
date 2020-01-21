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
  const addLink = `mutation {
    addLink(title:"asdf", takeaways:"asdf", url:"my url") {
      id
    }}`;
  const updateLink = `mutation {
  updateLink(id:"0", url:"asdf", takeaways:"asdf", title: "My title") {
    id
  }
}`;

  it("should give empty values when nothing except title is given", () => {
    tester.test(true, addLink, {
      title: "test@test.com",
      takeaways: "test",
      url: "test",
      password: "test",
      categories: []
    });
  });
});
