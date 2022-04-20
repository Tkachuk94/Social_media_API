const { Schema, model } = require('mongoose');
const reaction_schema = require('./Reaction');
const dateFormat = require('../utils/dateFormat');

const thought_schema = new Schema(
  {
    thoughtText: {
      type: String,
      required: 'Thought text is required',
      minlength: 1,
      maxlength: 280
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: timestamp => dateFormat(timestamp)
    },
    username: {
      type: String,
      required: true
    },
    reactions: [reaction_schema]
  },
  {
    toJSON: {
      getters: true
    },
    id: false
  }
);

//How many reactions a thought has
thought_schema.virtual('reactionCount').get(function() {
  return this.reactions.length;
});

const Thought = model('Thought', thought_schema);

module.exports = Thought;