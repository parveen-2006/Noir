import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import UserPage from './pages/UserPage';
import RolePage from './pages/RolePage';
import AccessDenied from './components/AccessDenied';
import { api } from './services/api';
import { loginSuccess, logout } from './store/authSlice';
import { setUsers, addUser, updateUser } from './store/userSlice';
import { setRoles, addRole, updateRole, removeRole } from './store/roleSlice';
import './styles.css';

const toTimestamp = (value) => {
  if (typeof value === 'number') return value;

  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : 0;
};

function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const expiresAt = useSelector((state) => state.auth.expiresAt);
  const users = useSelector((state) => state.users.list);
  const roles = useSelector((state) => state.roles.list);
  const currentUser = useSelector((state) => state.auth.user);
  const [appError, setAppError] = useState('');
  const permissions = roles.find((role) => role.name === currentUser?.role)?.permissions || currentUser?.permissions || [];
  const can = (permission) => permissions.includes(permission);

  useEffect(() => {
    const storedSession = api.getStoredSession();

    if (!storedSession) {
      return;
    }

    const remainingMs = toTimestamp(storedSession.expiresAt) - Date.now();

    if (remainingMs <= 0) {
      api.clearSession();
      dispatch(logout());
      return;
    }

    if (!isAuthenticated) {
      dispatch(
        loginSuccess({
          user: storedSession.user,
          token: storedSession.token,
          expiresAt: storedSession.expiresAt,
        })
      );
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated || !expiresAt) return;

    const remainingMs = toTimestamp(expiresAt) - Date.now();
    if (remainingMs <= 0) {
      api.clearSession();
      dispatch(logout());
      return;
    }

    const timer = setTimeout(() => {
      api.clearSession();
      dispatch(logout());
    }, remainingMs);

    return () => clearTimeout(timer);
  }, [dispatch, expiresAt, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadData = async () => {
      try {
        const [userResponse, roleResponse] = await Promise.all([
          api.getUsers(),
          api.getRoles(),
        ]);

        dispatch(setUsers(userResponse.users || []));
        dispatch(setRoles(roleResponse.roles || []));
      } catch (error) {
        const message = `Unable to load users and roles: ${error.message}`;
        console.error('[Noir] Data loading failed:', error);
        setAppError(message);
      }
    };

    loadData();
  }, [dispatch, isAuthenticated]);

  const handleLogin = async ({ email, password }) => {
    try {
      const response = await api.login({ email, password });
      dispatch(
        loginSuccess({
          user: response.user,
          token: response.token,
          expiresAt: response.expiresAt,
        })
      );
      return { success: true };
    } catch (error) {
      console.error('[Noir] Login failed:', error);
      return { success: false, message: error.message || 'Unable to sign in.' };
    }
  };

  const handleLogout = () => {
    api.clearSession();
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

  const handleUpdateUser = async (id, updatedUser) => {
    try {
      const response = await api.updateUser(id, updatedUser);
      dispatch(updateUser(response.user));
      return true;
    } catch (error) {
      const message = `Unable to update user: ${error.message}`;
      console.error('[Noir] User update failed:', error);
      setAppError(message);
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

  const handleUpdateRole = async (id, updatedRole) => {
    try {
      const response = await api.updateRole(id, updatedRole);
      dispatch(updateRole(response.role));
      return true;
    } catch (error) {
      setAppError(`Unable to update role: ${error.message}`);
      return false;
    }
  };

  const handleDeleteRole = async (id) => {
    try {
      await api.deleteRole(id);
      dispatch(removeRole(id));
      return true;
    } catch (error) {
      setAppError(`Unable to delete role: ${error.message}`);
      return false;
    }
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <Sidebar onLogout={handleLogout} can={can} />

      <main className="flex-1 p-4 md:p-8">
        {appError && (
          <div className="mb-5 flex items-center justify-between gap-4 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100" role="alert">
            <span>{appError}</span>
            <button type="button" onClick={() => setAppError('')} className="text-amber-700 hover:text-amber-950" aria-label="Dismiss error">Dismiss</button>
          </div>
        )}
        <Routes>
          <Route path="/" element={can('dashboard.view') ? <DashboardPage /> : <AccessDenied />} />
          <Route path="/users" element={can('users.view') ? <UserPage onCreateUser={handleCreateUser} onUpdateUser={handleUpdateUser} users={users} roles={roles} can={can} /> : <AccessDenied />} />
          <Route path="/roles" element={can('roles.view') ? <RolePage roles={roles} users={users} onCreateRole={handleCreateRole} onUpdateRole={handleUpdateRole} onDeleteRole={handleDeleteRole} can={can} /> : <AccessDenied />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
