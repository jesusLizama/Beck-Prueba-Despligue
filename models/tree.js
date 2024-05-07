const mongoose = require('mongoose');

const treeSchema = new mongoose.Schema({
  "66151d0bcc0535e96a0e7aed": {
    type: Number,
    default: 0
  },
  "66151d0bcc0535e96a0e7aef": {
    type: Number,
    default: 0
  },
  "66151d0bcc0535e96a0e7ae7": {
    type: Number,
    default: 0
  },
  "66151d0bcc0535e96a0e7aeb": {
    type: Number,
    default: 0
  },
  "66151d0bcc0535e96a0e7ae9": {
    type: Number,
    default: 0
  },
  "66151d0bcc0535e96a0e7ae3": {
    type: Number,
    default: 0
  },
  "66151d0bcc0535e96a0e7ae1": {
    type: Number,
    default: 0
  },
  "66151d0bcc0535e96a0e7ae5": {
    type: Number,
    default: 0
  },
  "661520ab4fe57713db09c86b": {
    type: Number,
    default: 0
  },
  "66151d0bcc0535e96a0e7ad9": {
    type: Number,
    default: 0
  },
  "66151d0bcc0535e96a0e7adb": {
    type: Number,
    default: 0
  },
  "66151d0bcc0535e96a0e7add": {
    type: Number,
    default: 0
  },
  "66151d0bcc0535e96a0e7adf": {
    type: Number,
    default: 0
  },
  "66151d0acc0535e96a0e7ad3": {
    type: Number,
    default: 0
  },
  "66151d0acc0535e96a0e7ad1": {
    type: Number,
    default: 0
  },
  "66151d0acc0535e96a0e7ad5": {
    type: Number,
    default: 0
  },
  "66151d0bcc0535e96a0e7ad7": {
    type: Number,
    default: 0
  },
  "661a8d548821445f3797f221": {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    default: 0
  }
});

const Tree = mongoose.model('Tree', treeSchema);

module.exports = Tree;
