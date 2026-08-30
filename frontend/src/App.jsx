import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import UserPage from './pages/UserPage';
import RolePage from './pages/RolePage';
import { api } from './services/api';
import { loginSuccess, logout } from './store/authSlice';
import { setUsers, addUser } from './store/userSlice';
import { setRoles, addRole } from './store/roleSlice';
import './styles.css';

function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const users = useSelector((state) => state.users.list);
  const roles = useSelector((state) => state.roles.list);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [userResponse, roleResponse] = await Promise.all([
          api.getUsers(),
          api.getRoles(),
        ]);

        dispatch(setUsers(userResponse.users || []));
        dispatch(setRoles(roleResponse.roles || []));
      } catch (error) {
        console.error('Failed to load app data:', error.message);
      }
    };

    loadData();
  }, [dispatch]);

  const handleLogin = async ({ email, password }) => {
    try {
      const response = await api.login({ email, password });
      dispatch(loginSuccess(response.user));
      return true;
    } catch (error) {
      console.error(error.message);
      return false;
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleCreateUser = async (newUser) => {
    try {
      const response = await api.createUser(newUser);
      dispatch(addUser(response.user));
      return true;
    } catch (error) {
      console.error(error.message);
      return false;
    }
  };

  const handleCreateRole = async (newRole) => {
    try {
      const response = await api.createRole(newRole);
      dispatch(addRole(response.role));
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
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar onLogout={handleLogout} />

      <main className="flex-1 p-4 md:p-8">
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
