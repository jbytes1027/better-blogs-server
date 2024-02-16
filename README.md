# Better Blogs Server

The backend for Better Blogs, a reddit-like sharing platform for blog posts. Built to learn modern full stack development. The client is [here](https://github.com/jbytes1027/better-blogs-client).

## Tech Stack

- [Node.js](https://github.com/nodejs/node) for a JavaScript runtime
- [Express.js](https://github.com/expressjs/express) for a web framework
- [Jest](https://github.com/facebook/jest) for a testing framework
- JSON Web Tokens via [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) for authentication
- MongoDB via [mongoose](https://github.com/Automattic/mongoose) for data storage
- [ESLint](https://github.com/eslint/eslint) for linting
- [Prettier](https://github.com/prettier/prettier) for formatting

## Usage

### Setup

Set environment variables with the shell or a `.env` file. The environmental variables are `MONGODB_URI`, `MONGODB_URI_TEST`, `JWT_SECRET`, and `PORT`. Docker Compose can be used to start a local MongoDB instance for development with the file `docker-compose.mongo.dev.yml`

### Linting

Run `npm run lint` to check for linting errors and `npm run lint:fix` to format all code to spec.

### Development

Run `npm run dev` to start in development mode at [http://localhost:3001/](http://localhost:3001/).

### Deployment

Run `npm start` to start in production mode.
