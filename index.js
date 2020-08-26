const express = require("express");
const cookieParser = require("cookie-parser");
const csrf = require("csurf");
const { text } = require("express");

const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "pug");
app.use(cookieParser());
app.use(express.urlencoded());

const csrfProtection = csrf({cookie: true});



app.get("/", (req, res) => {
  res.render('index', { users, fields })
});

app.get("/create", (req, res) => {
  res.render('form', { users, fields })
});

const users = [
  {
    id: 1,
    firstName: "Jill",
    lastName: "Jack",
    email: "jill.jack@gmail.com"
  }
];

const fields = [
  {
    type: "text",
    name: "firstName"
  },
  {
    type: "text",
    name: "lastName"
  },
  {
    type: "email",
    name: "email"
  },
  {
    type: "password",
    name: "password"
  },
  {
    type: "password",
    name: "confirmedPassword"
  }
]


app.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = app;
