const { Schema, model } = require("mongoose");
const ReactionSchema = require("./Reaction");

const ThoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      maxlength: 280,
      required: "Thought is Required",
    },

    createdAt: {
      type: Date,
      default: Date.now,
      get: (date) => {
        return date.toDateString();
      },
    },

    username: {
      type: String,
      required: "Username is Required",
    },

    reactions: [ReactionSchema],
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

ThoughtSchema.virtual("reactionCount").get(function () {
  return this.reactions.length;
});

const Thought = model("Thought", ThoughtSchema);

module.exports = Thought;
