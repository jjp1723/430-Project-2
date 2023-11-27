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
  age: {
    type: Number,
    min: 0,
    required: true,
  },
  weight: {
    type: Number,
    min: 0,
    required: true,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

MediaSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  age: doc.age,
  weight: doc.weight,
});

const MediaModel = mongoose.model('Media', MediaSchema);
module.exports = MediaModel;
