const mongoose = require('mongoose');
const path = require('path');
const HOST = process.env.HOST;
const { FileModel } = require('../models');

module.exports = {
  uploadFiles: async (req, res, next) => {
    try {
      let { files } = req;
      const results = await Promise.all(
        files.map(async (f) => {
          let isImage = f.mimetype.split('/').includes('image');
          let fileName = f.name.trim().replace(' ', '_');
          let fileNameRegex = fileName.split('.')[0];

          const fileCount = await FileModel.countDocuments({
            name: { $regex: fileNameRegex, $options: 'i' },
          });

          if (fileCount) {
            fileName = fileName.split('.');
            fileName.splice(1, 0, `_${fileCount + 1}.`);
            fileName = fileName.join('');
          }

          const filePath = isImage
            ? path.join(__dirname, `../../public/images/${fileName}`)
            : path.join(__dirname, `../../static/${fileName}`);

          f.mv(filePath, (err) => err && res.status(500).json(err));

          const _id = new mongoose.Types.ObjectId();
          const fileUrl = isImage
          ? `${HOST}/images/${fileName}`
          : `${HOST}/api/v1/storage/download/${_id}`;

          return {
            _id,
            name: fileName,
            url: fileUrl,
            path: filePath,
            originalFileName: f.name,
            size: f.size,
            type: f.mimetype,
          };
        })
      );

      FileModel.create(results, (err) => {
        if (err) console.log('Error: ', err);
      });

      let resultsFile = [];
      resultsFile = results.map(file => {
        let { path, ...newFileData } = file
        return newFileData
      });

      res.send({
        success: true,
        results: resultsFile,
        message: 'Upload multiple file successfully!',
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        error,
        message: 'Something went wrong',
      });
    }
  },
}