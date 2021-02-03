const { FileModel } = require('../models');
const jwt = require('jsonwebtoken');

module.exports = {
  download: async (req, res, next) => {
    try {
      const file = await FileModel.findById(req.params.id);
      if (!file) {
        return next(
          createError(400, {
            success: false,
            message: "File don't existed",
          })
        );
      }
      res.download(file.path);
    } catch (error) {
      console.log('error: ', error);
      res.status(400).json({
        success: false,
        error,
        message: 'Unable to get data with provided.',
      });
    }
  },
  getToken: async (req, res, next) => {
    try {
      console.log(req.params.id)
      const file = await FileModel.findById(req.params.id);
      console.log(file)
      if (file) {
        const secretKey = process.env.JWT_TOKEN_STORAGE;
        const token = jwt.sign({
          exp: Math.floor(Date.now() / 1000) + (1 * 60),
          data: {
            _id: file._id
          }
        }, secretKey);
        const HOST = process.env.HOST;
        const url = `${HOST}/api/v1/storage/download-by-token/${file._id}?key=${token}`;
        res.json({
          success: true,
          data: {
            url
          },
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'File does not exist!',
        });
      }
    } catch (error) {
      console.log('error: ', error);
      res.status(400).json({
        success: false,
        error,
        message: 'Unable to get data with provided.',
      });
    }
  },
}