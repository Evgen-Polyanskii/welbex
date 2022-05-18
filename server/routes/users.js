const UserRepositories = require('../repositories/UserRepositories.js')
const resource = '/users';

module.exports = (app) => {
  app
    .get(`${resource}/new`, (req, res) => {
      const user = {};
      res.render('users/new', user);
    })
    .post(resource, async (req, res) => {
      try {
        const userRepositories = new UserRepositories(app);
        const token = await userRepositories.createUser(req.body);
        res.send(201, token);
      } catch (err) {
        const errors = err.errors.map(({ path, message }) => ({ [path]: message }));
        res.status(400).render('users/new', { user: req.body, errors });
      }
    })
}
