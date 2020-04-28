const express = require('express');
const {
  MongoClient,
} = require('mongodb');
const debug = require('debug')('app:authRoutes');
const passport = require('passport');

const authRouter = express.Router();

function router(nav) {
  // This time we are using the Post method for posting the data to the server
  authRouter.route('/signUp')
    .get((req, res) => {
      res.render('index', {
        nav,
        title: 'Sign Up'
        });
     })
    .post((req, res) => {
      // We shall now save the user credentials into the mongodb database
      // Pull the username and password from the request body
      const {
        username,
        password
      } = req.body;
      const dbName = 'libraryApp';
      const url = 'mongodb://localhost:27017';
      (async function addUser() {
        let client;
        try {
          client = await MongoClient.connect(url);
          debug('Connected correctly to server');
          const db = client.db(dbName);
          const col = db.collection('users');
          const user = {
            username,
            password
          };
          const results = await col.insertOne(user);
          debug(results);
          req.login(results.ops[0], () => {
            res.redirect('/auth/profile');
          });
        } catch (err) {
          debug(err);
        }
      }())
      debug(req.body);
      //res.json(req.body);
    });
  authRouter.route('/profile')
    .all((req, res, next) => {
      if (req.user) {
        next();
      } else {
        res.redirect('/');
      }
    })
    .get((req, res) => {
      res.json(req.user);
    });
  authRouter.route('/signin')
    .get((req, res) => {
      res.render('signin', {
      nav,
      title: 'Sign In'
      });
    })
    .post(passport.authenticate('local', {
      successRedirect: '/auth/profile',
      failRedirect: '/'
    }));
  return authRouter;
}

module.exports = router;