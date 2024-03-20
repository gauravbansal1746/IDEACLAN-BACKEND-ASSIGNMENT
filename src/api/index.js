const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const schema = require('./schema');
const bookResolvers = require('./resolvers/book');
const userResolvers = require('./resolvers/user');
const connectDB = require('../database/connection');
const authMiddleware = require('../utils/auth');
const dotenv = require('dotenv');

dotenv.config();

async function startServer() {
  const app = express();

  app.use(express.json());

  // Apply authentication middleware before any other middleware or routes
  app.use(authMiddleware);

  const server = new ApolloServer({
    typeDefs: schema,
    resolvers: [bookResolvers, userResolvers],
    context: ({ req }) => ({ user: req.user }),
  });

  await server.start();
  server.applyMiddleware({ app });

  // Connect to MongoDB
  await connectDB();

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`GraphQL Server running at http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startServer().catch(error => {
  console.error('Error starting server:', error.message);
});
