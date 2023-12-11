const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  // Storage-Related URL's
  app.get('/getStorage', mid.requiresLogin, controllers.Account.getStorage);
  app.post('/incStorage', mid.requiresLogin, controllers.Account.increaseStorage);
  app.post('/decStorage', mid.requiresLogin, controllers.Account.decreaseStorage);
  app.delete('/nuke', mid.requiresSecure, mid.requiresLogin, controllers.Media.nuke);

  // Media-Related URL's
  app.get('/getMedia', mid.requiresLogin, controllers.Media.getMedia);
  app.get('/getPublic', mid.requiresLogin, controllers.Media.getPublicMedia);
  app.post('/maker', mid.requiresLogin, controllers.Media.makeMedia);
  app.post('/toggleMedia', mid.requiresLogin, controllers.Media.toggleVisibility);
  app.delete('/deleteMedia', mid.requiresLogin, controllers.Media.deleteMedia);

  // Account-Related URL's
  app.get('/getUsers', mid.requiresSecure, mid.requiresLogin, controllers.Account.getUsers);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.post('/change', mid.requiresSecure, mid.requiresLogin, controllers.Account.change);
  app.post('/premium', mid.requiresSecure, mid.requiresLogin, controllers.Account.premium);
  app.delete('/deleteAccount', mid.requiresSecure, mid.requiresLogin, controllers.Account.deleteAccount);

  // Navigation-Related URL's
  app.get('/maker', mid.requiresLogin, controllers.Media.makerPage);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.get('/explore', mid.requiresSecure, mid.requiresLogin, controllers.Media.explorePage);
  app.get('/account', mid.requiresSecure, mid.requiresLogin, controllers.Account.accountPage);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.get('/*', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
