const { FileModel } = require('../models');
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
}