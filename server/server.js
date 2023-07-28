const express = require('express');
const session = require('express-session');
const path = require('path');
var cors = require('cors');
const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const routes = require('./controllers');
const PORT = process.env.PORT || 3001;

const app = express();

const sess = {
    secret: 'Super secret secret',
    cookie: {
      // milliseconds ref: http://expressjs.com/en/resources/middleware/session.html
      maxAge: 86400000,
    },
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
      db: sequelize,
    }),
  };

app.use(session(sess));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(routes);

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
    credentials: true,
  })
);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});


sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'))
})