const express = require('express');
// This is the new addition for the lesson12 and we added object ID to help get the Id
const {
  MongoClient, ObjectID,
} = require('mongodb');
const debug = require('debug')('app:bookRoutes');
// const bookRouter = express.Router();
// const sql = require('mssql');
// const debug = require('debug')('app:bookRoutes');
const bookRouter = express.Router();

function router(nav) {
  bookRouter.use((req, res, next) => {
    if (req.user) {
      next();
    } else {
      res.redirect('/');
    }
  });
  bookRouter.route('/')
    .get((req, res) => {
      const url = 'mongodb://localhost:27017';
      const dbName = 'libraryApp';
      (async function mongo() {
        let client;
        try {
          client = await MongoClient.connect(url);
          debug('connected successfully');
          const db = client.db(dbName);
          const col = await db.collection('books');

          // eslint-disable-next-line max-len
          // In mongo we use select to query the database for records. the find will bring back everything
          const books = await col.find().toArray();
          res.render(
            'bookListView', {
              nav,
              title: 'Library',
              books,
            },
          );
        } catch (err) {
          debug(err.stack);
        }
        client.close();
      }());
    });
  bookRouter.route('/:id')
    .get((req, res) => {
      const {
        id,
      } = req.params;
      const url = 'mongodb://localhost:27017';
      const dbName = 'libraryApp';
      (async function query() {
        let client;
        try {
          client = await MongoClient.connect(url);
          debug('connected successfully');
          const db = client.db(dbName);
          const col = await db.collection('books');
          // col.findOne will bring back just one record
          const book = await col.findOne({ _id: new ObjectID(id) });
          // spit out the retreived book so we can look at it
          debug(book);
          res.render(
            'bookView', {
              nav,
              title: 'Library',
              book,
            },
          );
        } catch (err) {
          debug(err.stack);
        }
        client.close();
      }());
    });
  return bookRouter;
}
module.exports = router;
