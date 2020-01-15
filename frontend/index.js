document.addEventListener("DOMContentLoaded", function() {
  const randomLinkQuery = `query {
  randomLink{
    id
    takeaways
    title
    url
    categories
  }
}`;
  const options = {
    method: "post",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      query: randomLinkQuery
    })
  };

  fetch(`http://localhost:4000`, options)
    .then(res => res.json())
    .then(({ data }) => {
      const randomLink = data.randomLink;
      console.log(randomLink);
    });
});
