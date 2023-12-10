const models = require('../models');

const { Media } = models;

// makerPage & explorePage Functions - Render the app and explore pages
const makerPage = async (req, res) => res.render('app');
const explorePage = async (req, res) => res.render('explore');

// makeMedia Function - Creates a new Media object in the database using provided data
const makeMedia = async (req, res) => {
  // Checking if there is a file uploaded than can have its data processed
  if (!req.files || !req.files.uploadFile || Object.keys(req.files).length === 0) {
    return res.status(400).json({ error: 'No file selected' });
  }

  // Checking if the uploaded file is an image
  if (!req.files.uploadFile.mimetype.includes('image/')) {
    return res.status(400).json({ error: 'Selected file is not an image' });
  }

  // Getting the provided description for the file; if it wasn't provided a default one is assigned
  let desc = req.body.description;
  if (!desc) {
    desc = 'No description provided';
  }

  // Storing all provided data needed to create a Media object
  const mediaData = {
    owner: req.session.account._id,
    name: req.files.uploadFile.name,
    data: req.files.uploadFile.data,
    size: req.files.uploadFile.size,
    mimetype: req.files.uploadFile.mimetype,
    md5: req.files.uploadFile.md5,
    description: desc,
    public: (req.body.visibility === 'public'),
  };

  try {
    // Creating a new Media object with the provided data and saving it to the database
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

// getMedia Function - Gets relevent data of all Media objects the user has created
const getMedia = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const docs = await Media.find(query).select('name size description uploadedDate public mimetype data').lean().exec();

    return res.json({ media: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving media!' });
  }
};

// getPublicMedia Function - Gets relevent data of all uploaded Media objects from the database
//  whose visibility is set to Public
const getPublicMedia = async (req, res) => {
  try {
    const query = { public: true };
    const docs = await Media.find(query).select('name description uploadedDate mimetype data owner').lean().exec();

    return res.json({ media: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retreiving public media!' });
  }
};

// deleteMedia Function - Deletes a specified Media object from the database
const deleteMedia = async (req, res) => {
  try {
    await Media.findByIdAndDelete(req.body._id);
    return res.status(201).json({ message: 'Media deleted' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error deleting media!' });
  }
};

// toggleVisibility Function - Toggles whether a specified Media object can be seen publicly
const toggleVisibility = async (req, res) => {
  try {
    const media = await Media.findOneAndUpdate({ _id: req.body }, { public: !req.body.public });
    return res.status(201).json({ media });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error changing visibility' });
  }
};

// nuke Function - Deletes all Media object owned by the current user
const nuke = async (req, res) => {
  try {
    await Media.deleteMany({ owner: req.session.account._id });
    return res.status(201).send();
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
  toggleVisibility,
  getPublicMedia,
  nuke,
};
