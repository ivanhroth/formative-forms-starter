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
  res.render('index', { users, fields });
});

app.get("/create", csrfProtection, (req, res) => {
  res.render('form', { users, fields, errors: [], csrfToken: req.csrfToken() });
});

app.post("/create", csrfProtection, (req, res) => {
  const { firstName, lastName, email, password, confirmedPassword } = req.body;
  const errors = [];

  if(!firstName) errors.push("Please provide a first name.");
  if(!lastName) errors.push("Please provide a last name.");
  if(!email) errors.push("Please provide an email.");
  if(!password) errors.push("Please provide a password.");
  if(!confirmedPassword) errors.push("Please confirm your password.");
  if(password !== confirmedPassword) errors.push("The provided values for the password and password confirmation fields did not match.");

  if(errors.length === 0) {
    let newUser = { firstName, lastName, email, password, id: users[users.length-1].id + 1 };
    users.push(newUser);
    res.redirect("/");
    return;
  }

  fields[0].value = firstName;
  fields[1].value = lastName;
  fields[2].value = email;

  res.render('form', { users, fields, errors, csrfToken: req.csrfToken() });

  fields[0].value = null;
  fields[1].value = null;
  fields[2].value = null;

  return;
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
