# [Values backend](https://fullchee-values-backend.herokuapp.com/)

## Links

- Backend GraphQL Server
  - [Website](https://fullchee-values-backend.herokuapp.com/)
  - [GitHub](https://github.com/Fullchee/values-backend)
- Frontend React App
  - [Website](https://fullchee-values.netlify.com/)
  - [GitHub](https://github.com/Fullchee/values-client)

## Tech

- powered by [graphql-yoga](https://github.com/prisma-labs/graphql-yoga)
  - Node.js & Express
    - Resolvers programmed in src/resolvers.js
      - data: plain JS objects
- [data reset function](https://fullchee-values-backend.herokuapp.com/reset)
  - password protected (stored in Heroku config)
    - (git-crypt didn't work well with Heroku)
  - passwords encrypted with bcrypt
- Easy script to update links from the production server
  - `yarn updateLinks`

## Install

### Prerequisites

- yarn
- Node.js

```bash
yarn install
yarn start
```

## Lessons learned

## TODOs

- Pick a date according to the last viewed
  - probability: time since last view = number of ballets
  - pick a random ballet
- Automated tests with Newman
