// Routes index

const start = require('./start');
const home = require('./home');
const authentication = require('./authentication');
const profile = require('./profile');
const pageNotFound = require('./404');
const charge = require('./charge');
const userApps = require('./userApps');
const adminOnly = require('./adminOnly');
const normalUser = require('./normalUser');
const demand = require('./demand');
const bid = require('./bid');

const quit_demand = require('./quit_demand');

// these are for gui ss purposes. they should be moved/fixed/edited for real app
const mostActive = require('./mostActive');
const payment = require('./payment');

const stripeExample = require('./stripeExample');
const paymentApi = require('./stripe');
const testApi = require('./test');

// route middleware to make sure a user is logged in
const isLoggedIn = (req, res, next) => {
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated()) {
    return next();
  }
  // if they aren't redirect them to start page
  res.redirect('/');
}

// route middleware to make sure user is superuser
const isSuperuser = (req, res, next) => {
  // If user is superuser, carry on
  if (req.user.local.usertype === 'superuser') {
    return next();
  }

  // if they aren't redirect them to the home page
  res.redirect('/home');
}

const checkIfRejected = (req, res, next) => {
  // If not rejected, continue
  if (req.user.local.accountStatus !== 'rejected') {
    return next();
  }
  // Otherwise render rejected page
  res.render('rejected.ejs', {
    user: req.user // get the user out of session and pass to template
  });
}

const checkIfAccepted = (req, res, next) => {
  // If not rejected, continue
  if (req.user.local.accountStatus !== 'accepted') {
    return next();
  }
  // Otherwise render rejected page
  res.render('accepted.ejs', {
    user: req.user // get the user out of session and pass to template
  });
}

const configureRoutes = (app, passport) => {
  start(app);
  quit_demand(app);
  home(app, isLoggedIn, checkIfRejected, checkIfAccepted);
  authentication(app, passport);
  profile(app, isLoggedIn, checkIfRejected, checkIfAccepted);
  charge(app);
  userApps(app, isLoggedIn, isSuperuser);
  adminOnly(app, isLoggedIn, isSuperuser);
  normalUser(app, isLoggedIn);
  demand(app, isLoggedIn);
  bid(app, isLoggedIn);

  // these are for gui ss purposes. they should be moved/fixed/edited for real app
  mostActive(app, isLoggedIn);
  payment(app, isLoggedIn);

  stripeExample(app);
  paymentApi(app);
  testApi(app);
  pageNotFound(app); // This should go last

};

module.exports = configureRoutes;
