import { useEffect, useState } from 'react';
import api from '../api/axios';

const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');

const AdminPanel = () => {
  const [reports, setReports] = useState([]);

  const load = () => api.get('/pest-reports').then(({ data }) => setReports(data.data)).catch(() => {});

  useEffect(() => { load(); }, []);

  const setStatus = async (id, status) => {
    await api.put(`/pest-reports/${id}/verify`, { status });
    load();
  };

  return (
    <div className="page">
      <h2>Admin — Pending Reports</h2>
      <div className="report-grid">
        {reports.map((r) => (
          <div key={r._id} className="report-card">
            <img src={`${API_ORIGIN}${r.image}`} alt="pest" />
            <p><strong>{r.crop}</strong> — {r.severity} — by {r.farmer?.name}</p>
            <p>{r.pest?.pestName ? r.pest.pestName.replace(/_/g, ' ') : 'Unspecified'}</p>
            <p className="detection-badge">
              {r.detectionMethod === 'AI-Assisted'
                ? `🤖 AI-Assisted${r.aiConfidence ? ` (${Math.round(r.aiConfidence * 100)}%)` : ''}`
                : '✍️ Manual'}
            </p>
            <p>Status: {r.status}</p>
            {r.status === 'Pending' && (
              <div className="actions">
                <button onClick={() => setStatus(r._id, 'Verified')}>Verify</button>
                <button onClick={() => setStatus(r._id, 'Rejected')}>Reject</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;
