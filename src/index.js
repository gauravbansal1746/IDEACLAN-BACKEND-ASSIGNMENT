const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const schema = require('./api/schema');
const bookResolvers = require('./api/resolvers/book');
const userResolvers = require('./api/resolvers/user');
const connectDB = require('./database/connection');
const authMiddleware = require('./utils/auth');
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

  // Apply the Apollo GraphQL middleware to the Express app
  server.applyMiddleware({ app });

  // Connect to MongoDB
  await connectDB();

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`GraphQL Server ready at http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startServer().catch(error => {
  console.error('Error starting server:', error.message);
});
