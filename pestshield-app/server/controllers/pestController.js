const Pest = require('../models/Pest');
const cropLifecycle = require('../data/cropLifecycle');

const getPests = async (req, res) => {
  const filter = req.query.crop ? { crop: req.query.crop } : {};
  const pests = await Pest.find(filter);
  res.json({ success: true, data: pests });
};

const getLifecycle = (req, res) => {
  const crop = req.params.crop;
  const stages = cropLifecycle[crop];
  if (!stages) return res.status(404).json({ success: false, message: 'Unknown crop' });
  res.json({ success: true, data: stages });
};

module.exports = { getPests, getLifecycle };
