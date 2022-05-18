const UserRepositories = require('../repositories/UserRepositories.js');

const resource = '/login';

module.exports = (app) => {
  const userRepositories = new UserRepositories(app);
  app
    .get(resource, (req, res) => {
      const signInForm = {};
      res.render('session/login', { signInForm });
    })
    .post(resource, async (req, res) => {
      try {
        const token = await userRepositories.loginUser(req.body);
        res.send(token);
      } catch (err) {
        res.status(400).send(err.message);
      }
    });
}
