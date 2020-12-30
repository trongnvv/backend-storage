const HttpStatus = require('http-status-codes');
const { FileModel } = require('../models');
module.exports = {
  download: async (req, res, next) => {
    try {
      const file = req.fileExisted;
      return res.download(file.path);
    } catch (error) {
      console.log('error: ', error);
      res.status(400).json({
        success: false,
        error,
        message: 'Unable to get data with provided.',
      });
    }
  },
  getFilesById: async (req, res, next) => {
    try {
      const { user } = req;
      const storage = await FileModel.find({ userID: user.userID });
      res.send(storage);
    } catch (error) {
      console.log('error: ', error);
      res.status(500).json({
        success: false,
        error,
        message: 'Unable to get data with provided credentials.',
      });
    }
  },
}