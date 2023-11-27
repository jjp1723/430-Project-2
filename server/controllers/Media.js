const models = require('../models');

const { Media } = models;

const makerPage = async (req, res) => res.render('app');

const makeMedia = async (req, res) => {
  if (!req.body.name || !req.body.age || !req.body.weight) {
    return res.status(400).json({ error: 'Both name and age are required!' });
  }

  const mediaData = {
    name: req.body.name,
    age: req.body.age,
    weight: req.body.weight,
    owner: req.session.account._id,
  };

  try {
    const newMedia = new Media(mediaData);
    await newMedia.save();
    return res.status(201).json({ name: newMedia.name, age: newMedia.age, weight: newMedia.weight });
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
    const docs = await Media.find(query).select('name age weight').lean().exec();

    return res.json({ media: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving media!' });
  }
};

const deleteMedia = async (req, res) => {
  try {
    const deleted = await Media.findByIdAndDelete({_id:req.body._id});
    return res.status(201).json({deleted});
  } catch (err) {
    console.log(err);
    return res.status(500).json({error:'Error deleting media!'});
  }
}

module.exports = {
  makerPage,
  makeMedia,
  getMedia,
  deleteMedia,
};
