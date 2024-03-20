const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

const userResolvers = {
  Query: {
    users: async () => {
      try {
        const users = await User.find();
        return users;
      } catch (err) {
        throw new Error('Failed to fetch users');
      }
    },
  },
  Mutation: {
    register: async (_, { username, password }) => {
      try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
          throw new Error('Username is already taken');
        }

        const newUser = new User({ username, password });
        const savedUser = await newUser.save();
        const token = jwt.sign({ id: savedUser._id, username: savedUser.username }, process.env.JWT_SECRET, { expiresIn: '720h' });
        
        return { token, user: savedUser };
      } catch (err) {
        console.error(err);
        throw new Error('Registration failed');
      }
    },
    login: async (_, { username, password }) => {
      try {
        const user = await User.findOne({ username });
        if (!user || user.password !== password) {
          throw new Error('Invalid credentials');
        }
        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET,{ expiresIn: '720h' });
        return { token, user };
        } catch (err) {
          throw new Error('Login failed');
        }
      },
    },
  };
  
  module.exports = userResolvers;
