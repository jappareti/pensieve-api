const express = require('express');

const router = express.Router();
const auth = require('../middlewares/auth');

const User = require('../models/user');
const Card = require('../models/card');
const Deck = require('../models/deck');

// GET /users/profile
router.get('/profile', auth, (req, res) => {
  const id = req.user._id;

  User.get(id)
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((response) => {
      res.status(500).json(response);
    });
});

// PUT /users/profile
router.put('/profile', auth, (req, res) => {
  const id = req.user._id;
  const { body } = req;

  User.update(body, id)
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((response) => {
      res.status(500).json(response);
    });
});

// DELETE /users/profile
router.delete('/profile', auth, (req, res) => {
  const user = req.user._id;

  User.delete(user)
    .then(() => Card.deleteAll(user))
    .then(() => Deck.deleteAll(user))
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((response) => {
      res.status(500).json(response);
    });
});

// POST /users/signup
router.post('/signup', (req, res) => {
  const { body } = req;
  let user;

  User.create(body)
    .then((response) => {
      user = response;
      return User.generateToken(user);
    })
    .then((token) => {
      // TODO: move token to request header
      res.status(200).json({ user, token });
    })
    .catch((error) => {
      if (error.message === 'Invalid User') {
        res.status(400).json(error);
      } else {
        res.status(500).json(error);
      }
    });
});

// POST /users/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  let user;

  User.authenticate(email, password)
    .then((response) => {
      user = response;
      return User.generateToken(user);
    })
    .then((token) => {
      // TODO: move token to request header
      res.status(200).json({ user, token });
    })
    .catch((error) => {
      if (error.message === 'Invalid User') {
        res.status(400).json(error);
      } else {
        res.status(500).json(error);
      }
    });
});

module.exports = router;
