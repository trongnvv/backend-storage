const mongoose = require('mongoose');
const { Schema } = mongoose;
const VarSchema = new Schema(
  {
    name: String,
    type: String,
    path: String,
    url: String,
    size: Number,
    deletedAt: Date,
    createdBy: String
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports = mongoose.model('File', VarSchema);
