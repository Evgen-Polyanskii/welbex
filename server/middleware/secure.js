const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const encrypt = (value) => crypto.createHash('sha256')
  .update(value)
  .digest('hex');

const signature = process.env.SESSION_KEY;

const generateToken = (payload) => {
  const expiration = '5h';
  const token = jwt.sign(payload, signature, { expiresIn: expiration });
  return { token };
};

const auth = (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (authHeader && authHeader.split(' ')[0] === 'Bearer') {
      const token = req.headers.authorization.split(' ')[1];
      req.user = jwt.verify(token, signature);
      return next();
    }
    return res.status(403).send({ error: 'Not authorized to access this resource' });
  } catch (err) {
    res.status(401).send({ error: 'UNAUTHORIZED' });
  }
};

module.exports = {
  encrypt, generateToken, auth
};
