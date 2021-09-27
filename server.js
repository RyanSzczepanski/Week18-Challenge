const { ObjectId } = require("bson");
const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3001;

const { User, Thought, Reaction } = require("./models/index");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost/socialapidb",
  {}
);

mongoose.set("debug", true);

//USER

app.post("/api/users", ({ body }, res) => {
  const user = new User(body);

  User.create(user)
    .then((dbUser) => {
      res.json(dbUser);
    })
    .catch((err) => {
      res.json(err);
    });
});

app.get("/api/users", (req, res) => {
  User.find({}).then((users) => {
    res.json(users);
  });
});

app.get("/api/users/:id", (req, res) => {
  User.find({ _id: req.params.id }).then((user) => {
    res.json(user);
  });
});

app.put("/api/users/:id", (req, res) => {
  User.findOneAndUpdate(
    { _id: req.params.id },
    { username: req.body.username, email: req.body.email }
  )
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      res.json(err);
    });
});

app.delete("/api/users/:id", (req, res) => {
  User.findOneAndDelete({ _id: req.params.id })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      res.json(err);
    });
});

//FRIENDS

app.post("/api/users/:userId/friends/:friendId", (req, res) => {
  User.findOneAndUpdate(
    { _id: req.params.userId },
    { $push: { friends: req.params.friendId } }
  )
    .then((dbUser) => {
      res.json(dbUser);
    })
    .catch((err) => {
      res.json(err);
    });
});

app.delete("/api/users/:userId/friends/:friendId", (req, res) => {
  User.findOneAndUpdate(
    { _id: req.params.userId },
    { $pull: { friends: req.params.friendId } }
  )
    .then((dbUser) => {
      res.json(dbUser);
    })
    .catch((err) => {
      res.json(err);
    });
});

//THOUGHTS

app.post("/api/thoughts", ({ body }, res) => {
  const thought = new Thought(body);
  Thought.create(thought)
    .then((dbThought) => {
      User.findOneAndUpdate(
        { _id: body.userId },
        { $push: { thoughts: dbThought._id } }
      ).then();
      res.json(dbThought);
    })
    .catch((err) => {
      res.json(err);
    });
});

app.get("/api/thoughts", (req, res) => {
  Thought.find({}).then((thoughts) => {
    res.json(thoughts);
  });
});

app.get("/api/thoughts/:id", (req, res) => {
  Thought.find({ _id: req.params.id }).then((thought) => {
    res.json(thought);
  });
});

app.put("/api/thoughts/:id", (req, res) => {
  Thought.findOneAndUpdate(
    { _id: req.params.id },
    { thoughtText: req.body.thoughtText }
  )
    .then((thought) => {
      res.json(thought);
    })
    .catch((err) => {
      res.json(err);
    });
});

app.delete("/api/thoughts/:id", (req, res) => {
  Thought.findOneAndDelete({ _id: req.params.id })
    .then((thought) => {
      res.json(thought);
    })
    .catch((err) => {
      res.json(err);
    });
});

//REACTIONS

app.post("/api/thoughts/:thoughtId/reactions", (req, res) => {
  Thought.findOneAndUpdate(
    { _id: req.params.thoughtId },
    { $push: { reactions: req.body } }
  )
    .then(() => {
      res.json(req.body);
    })
    .catch((err) => {
      res.json(err);
    });
});

app.get("/api/thoughts/:thoughtId/reactions", (req, res) => {
  Thought.find({ _id: req.params.thoughtId })
    .select({ reactions: 1 })
    .then((reactions) => {
      res.json(reactions);
    });
});

app.delete("/api/thoughts/:thoughtId/reactions/:reactionId", (req, res) => {
  Thought.findOneAndUpdate(
    { _id: req.params.thoughtId },
    { $pull: { reactions: {reactionId: ObjectId(req.params.reactionId)} } }
  )
    .then((thought) => {
      res.json(thought);
    })
    .catch((err) => {
      res.json(err);
    });
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});
