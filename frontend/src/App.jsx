import { Navigate, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import UserPage from './pages/UserPage';
import RolePage from './pages/RolePage';
import './styles.css';

function App() {
  return (
    <div className="app-shell">
      <Sidebar />

      <main className="content">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/users" element={<UserPage />} />
          <Route path="/roles" element={<RolePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
