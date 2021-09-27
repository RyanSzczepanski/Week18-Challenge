const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3001;

const { User, Thought, Reaction } = require('./models');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/socialapidb', {});

//mongoose.set('useCreateIndex', true);
mongoose.set('debug', true);

app.post('/create', ({ body }, res) => {
  const user = new User(body);

  User.create(user)
    .then(dbUser => {
      res.json(dbUser);
    })
    .catch(err => {
      res.json(err);
    });
});

app.get('/users', (req, res) => {
  User.find({}).then(users => {
    res.json(users);
  });
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});