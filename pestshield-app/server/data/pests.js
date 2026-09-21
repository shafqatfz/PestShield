// NOTE: keep pestName values here in sync with your teammate's model class
// names (class_indices.json from the training notebook) once it's ready —
// that's what lets an AI prediction match up to a Pest document automatically.
module.exports = [
  { pestName: 'Healthy', crop: 'Groundnut', description: 'No disease detected.', symptoms: 'N/A', treatment: 'Continue regular monitoring.' },
  { pestName: 'Rust', crop: 'Groundnut', description: 'Fungal disease causing rust-colored pustules.', symptoms: 'Orange-brown pustules on leaf underside.', treatment: 'Apply recommended fungicide (e.g. Mancozeb), remove infected debris.' },
  { pestName: 'Alternaria_Leaf_Spot', crop: 'Groundnut', description: 'Fungal leaf spot disease.', symptoms: 'Dark brown circular spots with concentric rings.', treatment: 'Fungicide spray, crop rotation.' },
  { pestName: 'Leaf_Spot', crop: 'Groundnut', description: 'Early/late leaf spot fungal disease.', symptoms: 'Small dark spots, yellow halo, leaf drop.', treatment: 'Fungicide application, remove infected leaves.' },
  { pestName: 'Rosette', crop: 'Groundnut', description: 'Viral disease spread by aphids.', symptoms: 'Stunted growth, mottled yellow-green leaves.', treatment: 'Control aphid vectors, remove infected plants.' },

  { pestName: 'Healthy', crop: 'Potato', description: 'No disease detected.', symptoms: 'N/A', treatment: 'Continue regular monitoring.' },
  { pestName: 'Early_Blight', crop: 'Potato', description: 'Fungal disease common in warm humid weather.', symptoms: 'Dark concentric-ring spots on older leaves.', treatment: 'Fungicide (Chlorothalonil), remove infected leaves.' },
  { pestName: 'Late_Blight', crop: 'Potato', description: 'Aggressive fungal disease, can destroy crop quickly.', symptoms: 'Water-soaked spots turning brown/black, white mold underside.', treatment: 'Fungicide application immediately, destroy infected plants.' },

  { pestName: 'Healthy', crop: 'Chilli', description: 'No disease detected.', symptoms: 'N/A', treatment: 'Continue regular monitoring.' },
  { pestName: 'Leaf_Curl', crop: 'Chilli', description: 'Viral disease spread by whiteflies.', symptoms: 'Upward curling, crinkled leaves, stunted growth.', treatment: 'Control whitefly vectors, remove infected plants.' },
  { pestName: 'Cercospora_Leaf_Spot', crop: 'Chilli', description: 'Fungal leaf spot (frog-eye spot).', symptoms: 'Circular spots with grey center and dark margin.', treatment: 'Fungicide spray, avoid overhead irrigation.' },
];
