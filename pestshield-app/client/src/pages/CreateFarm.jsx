import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const CROPS = ['Groundnut', 'Potato', 'Chilli'];

const CreateFarm = () => {
  const [form, setForm] = useState({ farmName: '', cropType: 'Groundnut', district: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const submitFarm = async (coords) => {
    await api.post('/farms', { ...form, ...coords });
    navigate('/dashboard');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => submitFarm({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
          () => submitFarm({})
        );
      } else {
        await submitFarm({});
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create farm');
    }
  };

  return (
    <div className="form-page">
      <h2>Create Farm</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input placeholder="Farm Name" required
               value={form.farmName} onChange={(e) => setForm({ ...form, farmName: e.target.value })} />
        <select value={form.cropType} onChange={(e) => setForm({ ...form, cropType: e.target.value })}>
          {CROPS.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <input placeholder="District (optional)"
               value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} />
        <button type="submit">Create Farm</button>
      </form>
    </div>
  );
};

export default CreateFarm;
