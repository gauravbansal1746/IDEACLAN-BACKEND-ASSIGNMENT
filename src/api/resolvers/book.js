const Book = require('../models/Book');

const bookResolvers = {
  Query: {
    books: async () => {
      try {
        const books = await Book.find();
        return books;
      } catch (err) {
        throw new Error('Failed to fetch books');
      }
    },
    bookCount: async () => {
      try {
        const count = await Book.countDocuments();
        return count;
      } catch (err) {
        throw new Error('Failed to fetch book count');
      }
    },
  },
  Mutation: {
    addBook: async (_,args) => {
      try {
        const { title, author } = args.input;
        const newBook = new Book({ title, author });
        const savedBook = await newBook.save();
        return savedBook;
      } catch (err) {
        throw new Error('Failed to add book');
      }
    },
    buyBook: async (_, { bookId, userId }) => {
      try {
        const book = await Book.findById(bookId);
        if (!book) {
          throw new Error('Book not found');
        }
        if (!book.isAvailable) {
          throw new Error('Book is not available for purchase');
        }
        // Update book ownership and availability
        book.owner = userId;
        book.isAvailable = true;
        await book.save();
        return book;
      } catch (err) {
        throw new Error('Failed to buy book');
      }
    },
    requestToBorrow: async (_, { bookId, userId }) => {
      try {
        const book = await Book.findById(bookId);
        if (!book) {
          throw new Error('Book not found');
        }
        if (!book.isAvailable) {
          throw new Error('Book is not available for borrowing');
        }
        // Check if user has already requested
        const existingRequest = book.requests.find(
          (request) => request.user.toString() === userId && request.status === 'pending'
        );
        if (existingRequest) {
          throw new Error('You have already requested to borrow this book');
        }
        // Add new request
        book.requests.push({ user: userId });
        await book.save();
        return book;
      } catch (err) {
        throw new Error('Failed to request to borrow book');
      }
    },
    respondToBorrowRequest: async (_, { bookId, userId, status }) => {
      try {
        const book = await Book.findById(bookId);
        if (!book) {
          throw new Error('Book not found');
        }
        const request = book.requests.find(
          (request) => request.user.toString() === userId && request.status === 'pending'
        );
        if (!request) {
          throw new Error('Request not found or already responded');
        }
        if (status === 'approved') {
          // Update book ownership and availability
          book.owner = userId;
          book.isAvailable = false;
        }
        request.status = status;
        await book.save();
        return book;
      } catch (err) {
        throw new Error('Failed to respond to borrow request');
      }
    },
    returnBook: async (_, { bookId, userId }) => {
      try {
        const book = await Book.findById(bookId);
        if (!book) {
          throw new Error('Book not found');
        }
        if (!book.owner || book.owner.toString() !== userId) {
          throw new Error('You are not the owner of this book');
        }
        // Update book ownership and availability
        book.owner = null;
        book.isAvailable = true;
        // Clear requests
        book.requests = [];
        await book.save();
        return book;
      } catch (err) {
        throw new Error('Failed to return book');
      }
    },
  },
};

module.exports = bookResolvers;
