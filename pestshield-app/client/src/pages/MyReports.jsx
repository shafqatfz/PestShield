import { useEffect, useState } from 'react';
import api from '../api/axios';

const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');

const MyReports = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    api.get('/pest-reports/my').then(({ data }) => setReports(data.data)).catch(() => {});
  }, []);

  return (
    <div className="page">
      <h2>My Pest Reports</h2>
      <div className="report-grid">
        {reports.map((r) => (
          <div key={r._id} className="report-card">
            <img src={`${API_ORIGIN}${r.image}`} alt="pest" />
            <p><strong>{r.crop}</strong> — {r.severity}</p>
            <p>{r.pest?.pestName ? r.pest.pestName.replace(/_/g, ' ') : 'Unspecified'}</p>
            <p className="detection-badge">
              {r.detectionMethod === 'AI-Assisted'
                ? `🤖 AI-Assisted${r.aiConfidence ? ` (${Math.round(r.aiConfidence * 100)}%)` : ''}`
                : '✍️ Manual'}
            </p>
            <p>Status: <span className={`status ${r.status.toLowerCase()}`}>{r.status}</span></p>
            {r.description && <p>{r.description}</p>}
          </div>
        ))}
        {reports.length === 0 && <p>No reports yet.</p>}
      </div>
    </div>
  );
};

export default MyReports;
