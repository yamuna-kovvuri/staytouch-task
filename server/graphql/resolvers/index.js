const Student = require('./student');
const User = require('./user');

module.exports = {
  Query: {
    ...Student.Query,
  },
  Mutation: {
    ...User.Mutation,
    ...Student.Mutation,
  },
};
