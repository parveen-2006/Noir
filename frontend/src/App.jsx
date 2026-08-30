import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import UserPage from './pages/UserPage';
import RolePage from './pages/RolePage';
import { api } from './services/api';
import './styles.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [userResponse, roleResponse] = await Promise.all([
          api.getUsers(),
          api.getRoles(),
        ]);

        setUsers(userResponse.users || []);
        setRoles(roleResponse.roles || []);
      } catch (error) {
        console.error('Failed to load app data:', error.message);
      }
    };

    loadData();
  }, []);

  const handleLogin = async ({ email, password }) => {
    try {
      await api.login({ email, password });
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error(error.message);
      return false;
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const handleCreateUser = async (newUser) => {
    try {
      const response = await api.createUser(newUser);
      setUsers((current) => [response.user, ...current]);
      return true;
    } catch (error) {
      console.error(error.message);
      return false;
    }
  };

  const handleCreateRole = async (newRole) => {
    try {
      const response = await api.createRole(newRole);
      setRoles((current) => [response.role, ...current]);
      return true;
    } catch (error) {
      console.error(error.message);
      return false;
    }
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="app-shell">
      <Sidebar onLogout={handleLogout} />

      <main className="content">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/users" element={<UserPage onCreateUser={handleCreateUser} users={users} />} />
          <Route path="/roles" element={<RolePage onCreateRole={handleCreateRole} roles={roles} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
