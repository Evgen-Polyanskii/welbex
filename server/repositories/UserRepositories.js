const { generateToken } = require('../middleware/secure.js');

class UserRepositories {
  constructor(app) {
    this.models = app.get('models');
  }

  initialize(config) {
    this.context = config.context;
  }

  async createUser(data) {
    const user = await this.models.User.create(data);
    const userData = { id: user.id, nickname: user.nickname, email: user.email };
    return generateToken(userData);
  }
  async loginUser(args) {
    const { email, password } = args;
    const userRecord = await this.models.User.findOne({ where: { email } });
    if (!userRecord) {
      throw new Error('No user found with this login credentials.');
    }
    const correctPassword = userRecord.verifyPassword(password);
    if (!correctPassword) {
      throw new Error('Invalid password.');
    }
    const userData = { id: userRecord.id, nickname: userRecord.nickname, email };
    return generateToken(userData);
  }
}

module.exports = UserRepositories;
