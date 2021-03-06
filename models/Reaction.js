const { Schema, Types } = require("mongoose");

const ReactionSchema = new Schema({
  reactionId: {
    type: Schema.Types.ObjectId,
    default: () => new Types.ObjectId(),
  },

  reactionBody: {
    type: String,
    maxlength: 280,
    required: "Reaction is Required",
  },

  createdAt: {
    type: Date,
    default: Date.now,
    get: (date) => {
      return date.toString();
    },
  },

  username: {
    type: String,
    required: "Username is Required",
  },
},
{
  toJSON: {
    getters: true
  },
 _id: false
});

module.exports = ReactionSchema;
