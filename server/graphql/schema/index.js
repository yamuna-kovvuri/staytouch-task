const { mergeTypeDefs } = require('@graphql-tools/merge');

const Scaler = require('./scaler');
const Comman = require('./comman');
const User = require('./user');
const Student = require('./student');

const types = [
  Scaler,
  Comman,
  User,
  Student,
];

module.exports = mergeTypeDefs(types);
