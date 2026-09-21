const Farm = require('../models/Farm');

const createFarm = async (req, res) => {
  try {
    const { farmName, cropType, latitude, longitude, district } = req.body;
    const farm = await Farm.create({
      farmer: req.user._id,
      farmName,
      cropType,
      location: { latitude, longitude, district },
    });
    res.status(201).json({ success: true, data: farm });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getMyFarms = async (req, res) => {
  const farms = await Farm.find({ farmer: req.user._id });
  res.json({ success: true, data: farms });
};

module.exports = { createFarm, getMyFarms };
