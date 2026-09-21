import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const CONFIDENCE_THRESHOLD = 0.6;

const ReportPest = () => {
  const [farms, setFarms] = useState([]);
  const [pests, setPests] = useState([]);
  const [form, setForm] = useState({ farm: '', crop: '', pest: '', severity: 'Medium', description: '' });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  // AI suggestion state — separate from the form so a failed/slow AI call
  // never blocks the farmer from submitting manually.
  const [aiState, setAiState] = useState('idle'); // idle | loading | done | error
  const [aiResult, setAiResult] = useState(null);  // { predicted_class, confidence, confident }

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/farms/my').then(({ data }) => {
      setFarms(data.data);
      if (data.data.length > 0) {
        setForm((f) => ({ ...f, farm: data.data[0]._id, crop: data.data[0].cropType }));
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!form.crop) return;
    api.get(`/pests?crop=${form.crop}`).then(({ data }) => setPests(data.data)).catch(() => {});
  }, [form.crop]);

  const handleFarmChange = (farmId) => {
    const selected = farms.find((f) => f._id === farmId);
    setForm({ ...form, farm: farmId, crop: selected?.cropType || '', pest: '' });
    setAiState('idle');
    setAiResult(null);
  };

  const runPrediction = async (file, crop) => {
    setAiState('loading');
    setAiResult(null);
    try {
      const fd = new FormData();
      fd.append('crop', crop.toLowerCase());
      fd.append('image', file);
      const { data } = await api.post('/pest-detection/predict', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const result = data.data;
      setAiResult(result);
      setAiState('done');

      // Auto-select the matching pest in the manual dropdown, but only when
      // confident — a low-confidence guess should never be silently applied.
      if (result.confidence >= CONFIDENCE_THRESHOLD) {
        setPests((currentPests) => {
          const match = currentPests.find(
            (p) => p.pestName.toLowerCase() === result.predicted_class.toLowerCase()
          );
          if (match) setForm((f) => ({ ...f, pest: match._id }));
          return currentPests;
        });
      }
    } catch (err) {
      // AI service down/unreachable — degrade gracefully, manual selection still works
      setAiState('error');
    }
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setPreview(file ? URL.createObjectURL(file) : null);
    if (file && form.crop) runPrediction(file, form.crop);
  };

  const submitReport = async (coords) => {
    const selectedPest = pests.find((p) => p._id === form.pest);
    const aiConfirmed = aiResult && selectedPest && selectedPest.pestName.toLowerCase() === aiResult.predicted_class.toLowerCase();

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    Object.entries(coords).forEach(([k, v]) => fd.append(k, v));
    fd.append('image', imageFile);
    if (aiResult) {
      fd.append('aiPredictedPest', aiResult.predicted_class);
      fd.append('aiConfidence', aiResult.confidence);
    }
    fd.append('detectionMethod', aiConfirmed ? 'AI-Assisted' : 'Manual');

    await api.post('/pest-reports', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    navigate('/my-reports');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!imageFile) return setError('Please attach a photo of the affected leaf.');
    if (!form.pest) return setError('Please select the pest/disease (or wait for the AI suggestion above).');
    setSubmitting(true);
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => submitReport({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
          () => submitReport({})
        );
      } else {
        await submitReport({});
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Could not submit report');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="form-page">
      <h2>Report a Pest</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>Farm</label>
        <select value={form.farm} onChange={(e) => handleFarmChange(e.target.value)} required>
          <option value="">Select a farm</option>
          {farms.map((f) => <option key={f._id} value={f._id}>{f.farmName} ({f.cropType})</option>)}
        </select>

        <label>Photo</label>
        <input type="file" accept="image/*" onChange={handleImage} required />
        {preview && <img src={preview} alt="preview" className="preview" />}

        {aiState === 'loading' && (
          <div className="ai-box ai-loading">Analyzing photo...</div>
        )}
        {aiState === 'done' && aiResult && aiResult.confidence >= CONFIDENCE_THRESHOLD && (
          <div className="ai-box ai-confident">
            <strong>AI Suggestion:</strong> {aiResult.predicted_class} — {Math.round(aiResult.confidence * 100)}% confidence
            <div className="ai-note">Auto-selected below — change it if this looks wrong.</div>
          </div>
        )}
        {aiState === 'done' && aiResult && aiResult.confidence < CONFIDENCE_THRESHOLD && (
          <div className="ai-box ai-unsure">
            AI isn't confident about this one ({Math.round(aiResult.confidence * 100)}%). Please select the pest manually below.
          </div>
        )}
        {aiState === 'error' && (
          <div className="ai-box ai-unavailable">AI check unavailable right now — select the pest manually below.</div>
        )}

        <label>Pest / Disease</label>
        <select value={form.pest} onChange={(e) => setForm({ ...form, pest: e.target.value })} required>
          <option value="">Select pest/disease</option>
          {pests.map((p) => <option key={p._id} value={p._id}>{p.pestName.replace(/_/g, ' ')}</option>)}
        </select>

        <label>Severity</label>
        <select value={form.severity} onChange={(e) => setForm({ ...form, severity: e.target.value })}>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <label>Description</label>
        <textarea placeholder="What do you notice on the leaves?"
                  value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />

        <button type="submit" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit Report'}</button>
      </form>
    </div>
  );
};

export default ReportPest;
