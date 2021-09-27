const { Schema, model, Types } = require("mongoose");
const Thought = require("./Thought")

const UserSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      trim: true,
      required: "First Name is Required",
    },

    email: {
      type: String,
      unique: true,
      required: "Email is Required",
      match: [/.+@.+\..+/, "Please enter a valid e-mail address"],
    },

    thoughts: [{type : Types.ObjectId, ref: 'Thought'}],

    friends: [{type : Types.ObjectId, ref: 'User'}],
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

UserSchema.virtual("friendCount").get(function () {
  return this.friends.length;
});

const User = model("User", UserSchema);

module.exports = User;
