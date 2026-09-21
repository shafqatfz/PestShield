const PestReport = require('../models/PestReport');

const createReport = async (req, res) => {
  try {
    const {
      farm, crop, pest, severity, description, latitude, longitude,
      aiPredictedPest, aiConfidence, detectionMethod,
    } = req.body;
    if (!req.file) return res.status(400).json({ success: false, message: 'Image is required' });

    const report = await PestReport.create({
      farmer: req.user._id,
      farm,
      crop,
      pest: pest || undefined,
      severity,
      description,
      image: `/uploads/${req.file.filename}`,
      latitude,
      longitude,
      aiPredictedPest: aiPredictedPest || undefined,
      aiConfidence: aiConfidence !== undefined && aiConfidence !== '' ? Number(aiConfidence) : undefined,
      detectionMethod: detectionMethod === 'AI-Assisted' ? 'AI-Assisted' : 'Manual',
    });
    res.status(201).json({ success: true, data: report });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getMyReports = async (req, res) => {
  const reports = await PestReport.find({ farmer: req.user._id }).populate('pest').sort({ createdAt: -1 });
  res.json({ success: true, data: reports });
};

const getAllReports = async (req, res) => {
  const reports = await PestReport.find()
    .populate('farmer', 'name email')
    .populate('pest')
    .sort({ createdAt: -1 });
  res.json({ success: true, data: reports });
};

const verifyReport = async (req, res) => {
  const { status } = req.body;
  const report = await PestReport.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!report) return res.status(404).json({ success: false, message: 'Report not found' });
  res.json({ success: true, data: report });
};

module.exports = { createReport, getMyReports, getAllReports, verifyReport };
