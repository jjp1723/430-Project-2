const models = require('../models');

const { Media } = models;

const makerPage = async (req, res) => res.render('app');
const explorePage = async (req, res) => res.render('explore');

const makeMedia = async (req, res) => {
  console.log(req.body.description);
  if (!req.files || !req.files.uploadFile || Object.keys(req.files).length === 0) {
    return res.status(400).json({ error: 'No file selected' });
  }

  let desc = req.body.description;

  if(!desc){
    desc = 'No description provided';
  }

  const mediaData = {
    owner: req.session.account._id,
    name: req.files.uploadFile.name,
    data: req.files.uploadFile.data,
    size: req.files.uploadFile.size,
    mimetype: req.files.uploadFile.mimetype,
    md5: req.files.uploadFile.md5,
    description: desc,
    public: (req.body.public === 'public'),
  };

  console.log(mediaData);

  try {
    const newMedia = new Media(mediaData);
    const doc = await newMedia.save();
    return res.status(201).json({
      message: 'File Stored Successfully',
      file: newMedia.file,
      description: doc.description,
      public: doc.public,
    });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Media already exists!' });
    }
    return res.status(500).json({ error: 'An error occured making media!' });
  }
};

const getMedia = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const docs = await Media.find(query).select('name size description uploadedDate public').lean().exec();

    return res.json({ media: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving media!' });
  }
};

const deleteMedia = async (req, res) => {
  try {
    const deleted = await Media.findByIdAndDelete({ _id: req.body._id });
    return res.status(201).json({ deleted });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error deleting media!' });
  }
};

module.exports = {
  makerPage,
  makeMedia,
  getMedia,
  deleteMedia,
  explorePage,
};
