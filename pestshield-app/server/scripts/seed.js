require('dotenv').config();
const connectDB = require('../config/db');
const Pest = require('../models/Pest');
const pests = require('../data/pests');

const run = async () => {
  await connectDB();
  await Pest.deleteMany({});
  await Pest.insertMany(pests);
  console.log(`Seeded ${pests.length} pests.`);
  process.exit(0);
};

run();
