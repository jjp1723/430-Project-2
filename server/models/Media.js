const mongoose = require('mongoose');
const _ = require('underscore');

const setname = (name) => _.escape(name).trim();

const MediaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setname,
  },
  description: {
    type: String,
    trim: true,
  },
  data: {
    type: Buffer,
    required: true,
  },
  size: {
    type: Number,
    min: 0,
    required: true,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  mimetype: {
    type: String,
    required: true,
  },
  md5: {
    type: String,
    required: true,
  },
  uploadedDate: {
    type: Date,
    default: Date.now,
  },
});

MediaSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  description: doc.description,
  data: doc.data,
  size: doc.size,
  mimetype: doc.mimetype,
  md5: doc.md5,
  uploadedDate: doc.uploadedDate,
});

const MediaModel = mongoose.model('Media', MediaSchema);
module.exports = MediaModel;
