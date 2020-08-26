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

const validateNormalFields = (req, res, next) => {
  const { firstName, lastName, email, password, confirmedPassword } = req.body;
  res.errors = [];
  if (!firstName) res.errors.push("Please provide a first name.");
  if (!lastName) res.errors.push("Please provide a last name.");
  if (!email) res.errors.push("Please provide an email.");
  if (!password) res.errors.push("Please provide a password.");
  if (!confirmedPassword) res.errors.push("Please confirm your password.");
  if (password !== confirmedPassword) res.errors.push("The provided values for the password and password confirmation fields did not match.");
  next();
}

const validateInterestingFields = (req, res, next) => {
  const { age, favoriteBeatle, iceCream } = req.body;
  if (!age) res.errors.push("age is required");
  if (isNaN(Number(age)) || Number(age) > 120 || Number(age) < 0) res.errors.push("age must be a valid age");
  if (!favoriteBeatle) res.errors.push("favoriteBeatle is required");
  if (!["John", "George", "Paul", "Ringo"].includes(favoriteBeatle)) res.errors.push("favoriteBeatle must be a real Beatle member");
  next();
}

app.get("/", (req, res) => {
  res.render('index', { users, fields });
});

app.get("/create", csrfProtection, (req, res) => {
  res.render('form', { users, fields, errors: [], csrfToken: req.csrfToken() });
});

app.post("/create", csrfProtection, validateNormalFields, (req, res) => {
  const { firstName, lastName, email, password, confirmedPassword } = req.body;

  if(res.errors.length === 0) {
    let newUser = { firstName, lastName, email, password, id: users[users.length-1].id + 1 };
    users.push(newUser);
    res.redirect("/");
    return;
  }

  fields[0].value = firstName;
  fields[1].value = lastName;
  fields[2].value = email;

  res.render('form', { users, fields, errors: res.errors, csrfToken: req.csrfToken() });

  fields[0].value = null;
  fields[1].value = null;
  fields[2].value = null;

  return;
});

app.get("/create-interesting", csrfProtection, (req, res) => {
  res.render("interesting-form", { users, fields: interestingFields, errors: [], csrfToken: req.csrfToken(), iceCreamChecked: false, beatlesTracker });
})

app.post("/create-interesting", csrfProtection, validateNormalFields, validateInterestingFields, (req, res) => {
  const { firstName, lastName, email, age, favoriteBeatle, iceCream, password, confirmedPassword } = req.body;
  let iceCreamChecked = !(!iceCream);

  if (res.errors.length === 0) {
    let newUser = { firstName, lastName, email, age, favoriteBeatle, iceCream: iceCreamChecked, password, id: users[users.length - 1].id + 1 };
    users.push(newUser);
    res.redirect("/");
    return;
  }

  interestingFields[0].value = firstName;
  interestingFields[1].value = lastName;
  interestingFields[2].value = email;
  interestingFields[3].value = age;
  //interestingFields[4].value = favoriteBeatle;
  for (let beatle in beatlesTracker) beatlesTracker[beatle] = false;
  beatlesTracker[favoriteBeatle] = true;


  res.render('interesting-form', { users, fields: interestingFields, errors: res.errors, csrfToken: req.csrfToken(), iceCreamChecked, beatlesTracker });

  interestingFields[0].value = null;
  interestingFields[1].value = null;
  interestingFields[2].value = null;
  interestingFields[3].value = null;
  interestingFields[4].value = null;
  interestingFields[5].value = null;

  return;
});

const beatlesTracker = {
  John: false,
  George: false,
  Paul: false,
  Ringo: false,
  "Scooby-Doo": false
}

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

const interestingFields = [
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
    type: "number",
    name: "age"
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
