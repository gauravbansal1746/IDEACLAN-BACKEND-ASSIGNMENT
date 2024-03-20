const { buildSchema } = require('graphql');

const schema = buildSchema(`
  type Query {
    books: [Book]
    users: [User]
    bookCount:Int
  }
  type Request {
    user: User!
    status: String!
  }

  type Book {
    id: ID!
    title: String!
    author: String!
    isAvailable: Boolean!
    owner: User
    requests: [Request]
  }

  type User {
    id: ID!
    username: String!
    role: String
    booksOwned: [Book]
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  input AddBookInput {
    title: String!
    author: String!
  }

   type Mutation {
    register(username: String!, password: String!, email: String!): AuthPayload
    login(username: String!, password: String!): AuthPayload
    addBook(input: AddBookInput!): Book
    buyBook(bookId: ID!, userId: ID!): Book
    requestToBorrow(bookId: ID!, userId: ID!): Book
    respondToBorrowRequest(bookId: ID!, userId: ID!, status: String!): Book
    returnBook(bookId: ID!, userId: ID!): Book
  }
`);

module.exports = schema;
