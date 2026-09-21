import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [farms, setFarms] = useState([]);

  useEffect(() => {
    api.get('/farms/my').then(({ data }) => setFarms(data.data)).catch(() => {});
  }, []);

  return (
    <div className="page">
      <h2>Welcome, {user?.name}</h2>

      <div className="card">
        <h3>My Farms</h3>
        {farms.length === 0 ? (
          <p>No farms yet. <Link to="/create-farm">Create one</Link> to get started.</p>
        ) : (
          <ul>
            {farms.map((f) => (
              <li key={f._id}>
                <Link to={`/crop-lifecycle/${f.cropType}`}>{f.farmName} — {f.cropType}</Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="quick-links">
        <Link to="/create-farm" className="btn">+ Add Farm</Link>
        <Link to="/report-pest" className="btn">Report a Pest</Link>
        <Link to="/my-reports" className="btn">My Reports</Link>
      </div>
    </div>
  );
};

export default Dashboard;
