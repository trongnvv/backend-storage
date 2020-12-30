"use strict";
const HttpStatus = require("http-status-codes");
module.exports = async (req, res, next) => {
  try {
    req.user = { userID: 'hellworld', username: 'trongnv' };
    next();
  } catch (error) {
    next({
      success: false,
      code: error.code || HttpStatus.BAD_REQUEST,
      status: error.code || HttpStatus.BAD_REQUEST,
      message: error.message,
    });
  }
};
