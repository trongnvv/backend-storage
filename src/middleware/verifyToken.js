const createError = require('http-errors');
const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  const id = req.params.id;
  const token = req.query.key;
  if (!token) {
    return next(
      createError(401, { status: 401, message: "Unauthorized" })
    );
  }
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_TOKEN_STORAGE);
  } catch (err) {
    return next(
      createError(401, { status: 401, message: "Unauthorized" })
    );
  }
  if (!decoded || !decoded.data || id !== decoded.data._id) {
    return next(
      createError(404, { status: 404, message: "File not found" })
    );
  }
  next();
};