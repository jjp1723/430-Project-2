const models = require('../models');

const { Account } = models;

// Render functions for the login and account pages
const loginPage = (req, res) => res.render('login');
const accountPage = (req, res) => res.render('account');

// logout Function - Destroys the current session and redirects to the login page
const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

// login Function - Handles requests to '/login'
const login = (req, res) => {
  // Get the values of the provided username and password
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;

  // Ensure the values provided are not NULL
  if (!username || !pass) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  // Authenticating the provided values with existing accounts and redirecting to the main app page
  return Account.authenticate(username, pass, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password!' });
    }

    req.session.account = Account.toAPI(account);

    return res.json({ redirect: '/maker' });
  });
};

// signup Function - Handles calls to '/signup'
const signup = async (req, res) => {
  // Get the values of the provided username and passwords
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;
  const pass2 = `${req.body.pass2}`;

  // Ensure the values provided are not NULL
  if (!username || !pass || !pass2) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  // Ensure the provided passwords match
  if (pass !== pass2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  // Creating a new account with the provided username and password and redirecting to the app page
  try {
    const hash = await Account.generateHash(pass);
    const newAccount = new Account({ username, password: hash });
    await newAccount.save();
    req.session.account = Account.toAPI(newAccount);
    return res.json({ redirect: '/maker' });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Username already in use!' });
    }
    return res.status(500).json({ error: 'An error has occured!' });
  }
};

// change Function - Handles calls to '/change'
const change = async (req, res) => {
  // Get the values of the provided old and new passwords
  const passOld = `${req.body.passwordOld}`;
  const passNew1 = `${req.body.passwordNew1}`;
  const passNew2 = `${req.body.passwordNew2}`;

  // Ensure the values provided are not NULL
  if (!passOld || !passNew1 || !passNew2) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  // Ensure the provided new passwords match
  if (passNew1 !== passNew2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  // To-Do: Update the password associated with the user currently logged in
  try {
    // const hash = await Account.generateHash(passNew1);
    // const newAccount = new Account({ username: req.session.account, password: hash });
    // await newAccount.save();
    // req.session.account = Account.toAPI(newAccount);
    return res.status(201).json({ message: 'Password Change Successful' });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Password already in use!' });
    }
    return res.status(500).json({ error: 'An error has occured!' });
  }
};

// premium Function - Handles calls to '/premium'
const premium = async (req, res) => {
  // Get the value provided for whether to enable premium benefits
  const activate = `${req.body.enablePremium}`;

  // Ensure the value provided isn't null (not sure if this is even possible)
  if (!activate) {
    return res.status(400).json({ error: 'How did this happen!?' });
  }

  // To-Do: Toggle the 'premium' status of the current user account
  try {
    return res.status(201).json({ message: 'Premium status toggled' });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: `Premium status already set to ${activate}!` });
    }
    return res.status(500).json({ error: 'An error has occured!' });
  }
};

module.exports = {
  loginPage,
  login,
  logout,
  signup,
  change,
  premium,
  accountPage,
};