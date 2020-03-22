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

- Encrypting the reset password
  - used bcrypt and a Heroku config variable
  - I couldn't figure out how to use git-crypt with Heroku
- keywords generation
  - keywords.txt -> JSON
  - txt: easy to add/remove words
  - I initially put it in client
  - logically made sense to put it in the back-end, make it available via /keywords
- updateLink
  - mutation params can only be simple (no Link param)
    - I used a stringified object => way easier to create queries

## TODOs

- Automated tests with Newman
  - automate tests for adding all the user behaviours
  - stub the backend?
  - automated tests with the real backend
- add Anna Akana and In a Nutshell to values
- set the default "This is water" to prepopulate
- handle bugs
