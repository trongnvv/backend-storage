const createError = require('http-errors');

module.exports = async (req, res, next) => {
  try {
    const { isAuthenticated } = await getUser(req);
    if (!isAuthenticated) {
      return next(
        createError(401, {
          success: false,
          message: 'Not Authenticated',
        })
      );
    }
    next();
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'middleware permission error', errors: error });
  }
}

const getUser = async (req) => {
  const { authorization, cookie } = req.headers;

  if (!authorization && !(cookie && cookie.includes('storage-token'))) {
    return {
      isAuthenticated: false,
    };
  }

  const isBasicAuth = authorization && authorization.indexOf('Basic ') === 0;
  const token = authorization ?
    isBasicAuth
      ? authorization.replace('Basic ', '')
      : authorization.replace('Bearer ', '')
    : cookie
      .split(';')
      .find((c) => c.includes('storage-token'))
      .trim()
      .replace('storage-token=', '');

  if (isBasicAuth) {
    const credentials = Buffer.from(token, 'base64').toString();
    const [username, password] = credentials.split(':');
    console.log(username, password);
    const isAuthenticated = username === process.env.BASIC_AUTH_USERNAME && password === process.env.BASIC_AUTH_PASSWORD;
    return { isAuthenticated, type: 'basic' };
  }

  return { isAuthenticated, type: 'auth' };
}