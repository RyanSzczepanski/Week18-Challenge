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

//THOUGHTS

app.post("/api/thoughts", ({ body }, res) => {
  const thought = new Thought(body);
  Thought.create(thought)
    .then((dbThought) => {
      User.findOneAndUpdate(
        { _id: body.userId },
        { $push: { thoughts: dbThought } }
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

//REACTIONS

app.post("/api/thoughts/:id/reactions", (req, res) => {
  Thought.findOneAndUpdate(
    { _id: req.params.id },
    { $push: { reactions: req.body } }
  )
    .then(() => {
      res.json(req.body);
    })
    .catch((err) => {
      res.json(err);
    });
});

app.get("/api/thoughts/:id/reactions", (req, res) => {
  Thought.find({ _id: req.params.id })
    .select({ reactions: 1 })
    .then((reactions) => {
      res.json(reactions);
    });
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});
