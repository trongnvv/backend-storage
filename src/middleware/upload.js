const createError = require('http-errors');
const uuidv4 = require('uuid/v4');

module.exports = (req, res, next) => {
  try {
    let { files } = req.files;

    if (!files) {
      return next(createError(400, 'Please provide a file'));
    }
    if (!Array.isArray(files)) {
      files = [files];
    }
    
    files = files.map((f) => {
      if (f.name === 'blob') {
        return {
          ...f,
          name: `${uuidv4()}.${f.mimetype.split('/')[1]}`,
        };
      }
      return f;
    });

    const errors = files.map(
      (f) =>
        !f.size ||
        !f.mimetype.match(
          /\/(octet-stream|jpeg|png|gif|zip|gzip|txt|x-bzip|x-bzip2|bmp|csv|msword|vnd.openxmlformats-officedocument.wordprocessingml.document|vnd.amazon.ebook|aac|wav|tiff|epub+zip|svg+xml|odp|pdf|text\/plain|html|vnd.microsoft.icon|vnd.oasis.opendocument.presentation|vnd.oasis.opendocument.spreadsheet|vnd.oasis.opendocument.text|vnd.ms-powerpoint|vnd.openxmlformats-officedocument.presentationml.presentation|vnd.rar|rtf|vnd.visio|xhtml+xml|vnd.ms-excel|vnd.openxmlformats-officedocument.spreadsheetml.sheet|x-midi|xml|x-7z-compressed|mpeg|css|x-zip-compressed)$/
        )
    );
    if (errors.includes(true))
      next(
        createError(400, {
          success: false,
          message:
            'Unable to upload file with provided. File type is not accepted!',
          files,
        })
      );
    // console.log(files);
    req.files = files;
    next();
  } catch (error) {
    console.error('middleware upload error: ', error);
    res.status(400).json({ message: 'middleware upload error', errors: error });
  }
};
