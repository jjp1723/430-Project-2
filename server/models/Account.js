const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const saltRounds = 10;

let AccountModel = {};

const AccountSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    match: /^[A-Za-z0-9_\-.]{1,16}$/,
  },
  password: {
    type: String,
    required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  premium: {
    type: Boolean,
    default: false,
  },
  totalData: {
    type:Number,
    default:0,
  }
});

// toAPI function - Converts a doc to something that can be stored in Redis
AccountSchema.statics.toAPI = (doc) => ({
  username: doc.username,
  _id: doc._id,
});

// generateHadh function - Hashes a given password
AccountSchema.statics.generateHash = (password) => bcrypt.hash(password, saltRounds);

// authenticate function - Authenticates a given username and password
AccountSchema.statics.authenticate = async (username, password, callback) => {
  try {
    const doc = await AccountModel.findOne({ username }).exec();
    if (!doc) {
      return callback();
    }

    const match = await bcrypt.compare(password, doc.password);
    if (match) {
      return callback(null, doc);
    }
    return callback();
  } catch (err) {
    return callback(err);
  }
};

AccountModel = mongoose.model('Account', AccountSchema);
module.exports = AccountModel;
