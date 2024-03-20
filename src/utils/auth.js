const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;

  // if (!token) {
  //   return res.status(401).json({ message: 'Auth token is missing' });
  // }
  if(token)
  {
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedToken.user;
    next();
  } catch (error) {
    //return res.status(401).json({ message: 'Invalid token' });
  }
}
  next();
};

module.exports = authMiddleware;
