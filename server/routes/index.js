const welcome = require('./welcome.js');
const users = require('./users.js');
const session = require('./session.js');
const posts = require('./posts.js');


const controllers = [welcome, users, session, posts];

module.exports = (app) => controllers.forEach((f) => f(app));
