import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateFarm from './pages/CreateFarm';
import CropLifecycle from './pages/CropLifecycle';
import ReportPest from './pages/ReportPest';
import MyReports from './pages/MyReports';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/create-farm" element={<ProtectedRoute><CreateFarm /></ProtectedRoute>} />
        <Route path="/crop-lifecycle/:crop" element={<ProtectedRoute><CropLifecycle /></ProtectedRoute>} />
        <Route path="/report-pest" element={<ProtectedRoute><ReportPest /></ProtectedRoute>} />
        <Route path="/my-reports" element={<ProtectedRoute><MyReports /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute adminOnly><AdminPanel /></ProtectedRoute>} />
      </Routes>
    </>
  );
}

export default App;
