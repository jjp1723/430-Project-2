const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getMedia', mid.requiresLogin, controllers.Media.getMedia);
  app.get('/getPublic', mid.requiresLogin, controllers.Media.getPublicMedia);
  app.delete('/deleteMedia', mid.requiresLogin, controllers.Media.deleteMedia);
  app.post('/toggleMedia', mid.requiresLogin, controllers.Media.toggleVisibility);
  app.delete('/nuke', mid.requiresLogin, controllers.Media.nuke)

  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  app.get('/maker', mid.requiresLogin, controllers.Media.makerPage);
  app.post('/maker', mid.requiresLogin, controllers.Media.makeMedia);

  app.get('/explore', mid.requiresSecure, mid.requiresLogin, controllers.Media.explorePage);

  app.get('/account', mid.requiresSecure, mid.requiresLogin, controllers.Account.accountPage);
  app.post('/change', mid.requiresSecure, mid.requiresLogin, controllers.Account.change);
  app.post('/premium', mid.requiresSecure, mid.requiresLogin, controllers.Account.premium);
  app.get('/getUsers', mid.requiresSecure, mid.requiresLogin, controllers.Account.getUsers);
  app.delete('/deleteAccount', mid.requiresSecure, mid.requiresLogin, controllers.Account.deleteAccount);

  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
