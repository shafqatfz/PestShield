require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const farmRoutes = require('./routes/farmRoutes');
const pestRoutes = require('./routes/pestRoutes');
const pestReportRoutes = require('./routes/pestReportRoutes');
const pestDetectionRoutes = require('./routes/pestDetectionRoutes');

connectDB();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/farms', farmRoutes);
app.use('/api/pests', pestRoutes);
app.use('/api/pest-reports', pestReportRoutes);
app.use('/api/pest-detection', pestDetectionRoutes);

app.use('/api', (req, res) => res.status(404).json({ success: false, message: 'Route not found' }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({ success: false, message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`PestShield API running on port ${PORT}`));
