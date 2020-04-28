const express = require('express');
const morgan = require('morgan');
const path = require('path');
const debug = require('debug')('app');
// This is new module added via npm install
const bodyParser = require('body-parser');
// This is the new module that is added to the package
// Need to install npm install passport cookie-parser express-session
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');


const app = express();
const port = process.env.PORT || 3000;

// const config = {
//   user: 'node',
//   password: 'password',
//   server: 'SILAS-GAH',
//   database: 'PDLDb',
//   pool: {
//     max: 10,
//     min: 0,
//     idleTimeoutMillis: 30000,
//   },
// };

// sql.connect(config).catch((err) => debug(err));
app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '/public/')));
//New addition of use statements
app.use(cookieParser());
app.use(session({ secret: 'library' }));
require('./src/config/passport.js')(app);
app.use('/css', express.static(path.join(__dirname, '/node_modules/boostrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/boostrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/jquery/dist/')));
app.set('views', './src/views');
app.set('view engine', 'ejs');
const nav = [{ link: '/books', title: 'Book' },
  { link: '/author', title: 'Author' }];
const bookRouter = require('./src/routes/bookRoute')(nav);
const adminRouter = require('./src/routes/adminRoutes')(nav);
const authRouter = require('./src/routes/authRoutes')(nav);

app.use('/books', bookRouter);
app.use('/admin', adminRouter);
app.use('/auth', authRouter);
app.get('/', (req, res) => {
  res.render(
    'index',
    {
      nav: [{ link: '/books', title: 'Books' },
        { link: '/authors', title: 'Authors' }],
      title: 'Library',
    },
  );
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  debug(`Listeing on port ${port}`);
});
