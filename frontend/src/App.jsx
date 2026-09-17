import { useEffect, useMemo, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import UserPage from './pages/UserPage';
import RolePage from './pages/RolePage';
import AccessDenied from './components/AccessDenied';
import { api } from './services/api';
import { loginSuccess, updateCurrentUser, logout } from './store/authSlice';
import { setUsers, addUser, updateUser, removeUser } from './store/userSlice';
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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [userPage, setUserPage] = useState(1);
  const [userRefreshKey, setUserRefreshKey] = useState(0);
  const [showSessionPrompt, setShowSessionPrompt] = useState(false);
  const [sessionCountdown, setSessionCountdown] = useState(30);
  const [userPagination, setUserPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const permissions = roles.find((role) => role.name === currentUser?.role)?.permissions || currentUser?.permissions || [];
  const can = (permission) => permissions.includes(permission);

  const sessionExpiresAt = useMemo(() => toTimestamp(expiresAt), [expiresAt]);

  const syncCurrentUser = (user) => {
    dispatch(updateCurrentUser(user));
    const session = api.getStoredSession();
    if (session) api.saveSession({ ...session, user });
  };

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
    if (!isAuthenticated || !expiresAt) {
      setShowSessionPrompt(false);
      setSessionCountdown(30);
      return;
    }

    const checkInterval = setInterval(() => {
      const remainingMs = sessionExpiresAt - Date.now();
      if (remainingMs <= 0) {
        api.clearSession();
        dispatch(logout());
        clearInterval(checkInterval);
        return;
      }

      if (!showSessionPrompt) {
        setShowSessionPrompt(true);
        setSessionCountdown(30);
      }
    }, api.SESSION_CHECK_INTERVAL_MS || 60 * 60 * 1000);

    return () => clearInterval(checkInterval);
  }, [dispatch, isAuthenticated, expiresAt, sessionExpiresAt, showSessionPrompt]);

  useEffect(() => {
    if (!showSessionPrompt) return undefined;

    setSessionCountdown(30);
    const countdownInterval = setInterval(() => {
      setSessionCountdown((current) => {
        if (current <= 1) {
          clearInterval(countdownInterval);
          handleLogout();
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [showSessionPrompt]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadData = async () => {
      try {
        const [userResponse, roleResponse] = await Promise.all([
          api.getUsers({ page: userPage, limit: 10 }),
          api.getRoles(),
        ]);

        dispatch(setUsers(userResponse.users || []));
        dispatch(setRoles(roleResponse.roles || []));
        setUserPagination(userResponse.pagination || { page: userPage, totalPages: 1, total: 0 });
      } catch (error) {
        const message = `Unable to load users and roles: ${error.message}`;
        console.error('[Noir] Data loading failed:', error);
        setAppError(message);
      }
    };

    loadData();
  }, [dispatch, isAuthenticated, userPage, userRefreshKey]);

  const handleSessionContinue = async () => {
    try {
      const response = await api.continueSession();
      if (response?.expired) {
        handleLogout();
        return;
      }
      setShowSessionPrompt(false);
      setSessionCountdown(30);
    } catch (error) {
      console.error('[Noir] Session continue failed:', error);
      handleLogout();
    }
  };

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
    api.logoutSession();
    dispatch(logout());
    setShowSessionPrompt(false);
    setSessionCountdown(30);
  };

  const handleCreateUser = async (newUser) => {
    try {
      const response = await api.createUser(newUser);
      dispatch(addUser(response.user));
      setUserPage(1);
      setUserRefreshKey((current) => current + 1);
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
      if (currentUser?.id === id) syncCurrentUser(response.user);
      setUserRefreshKey((current) => current + 1);
      return true;
    } catch (error) {
      const message = `Unable to update user: ${error.message}`;
      console.error('[Noir] User update failed:', error);
      setAppError(message);
      return false;
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await api.deleteUser(id);
      dispatch(removeUser(id));
      setUserRefreshKey((current) => current + 1);
      return true;
    } catch (error) {
      setAppError(`Unable to delete user: ${error.message}`);
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
      const previousRole = roles.find((role) => role.id === id);
      const response = await api.updateRole(id, updatedRole);
      dispatch(updateRole(response.role));
      if (currentUser?.role === previousRole?.name) {
        syncCurrentUser({
          ...currentUser,
          role: response.role.name,
          permissions: response.role.permissions,
        });
      }
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
      <Sidebar
        onLogout={handleLogout}
        can={can}
        collapsed={isSidebarCollapsed}
        onExpand={() => setIsSidebarCollapsed(false)}
      />

      <main className={`${isSidebarCollapsed ? 'ml-20' : 'ml-64'} min-w-0 flex-1 transition-[margin-left] duration-300 ease-in-out`}>
        <Navbar user={currentUser} onToggleSidebar={() => setIsSidebarCollapsed((collapsed) => !collapsed)} />
        <div className="p-4 md:p-8">
          {appError && (
            <div className="mb-5 flex items-center justify-between gap-4 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100" role="alert">
              <span>{appError}</span>
              <button type="button" onClick={() => setAppError('')} className="text-amber-700 hover:text-amber-950" aria-label="Dismiss error">Dismiss</button>
            </div>
          )}
          <Routes>
            <Route path="/" element={can('dashboard.view') ? <DashboardPage /> : <AccessDenied />} />
            <Route path="/users" element={can('users.view') ? <UserPage onCreateUser={handleCreateUser} onUpdateUser={handleUpdateUser} onDeleteUser={handleDeleteUser} users={users} roles={roles} pagination={userPagination} onPageChange={setUserPage} can={can} /> : <AccessDenied />} />
            <Route path="/roles" element={can('roles.view') ? <RolePage roles={roles} users={users} onCreateRole={handleCreateRole} onUpdateRole={handleUpdateRole} onDeleteRole={handleDeleteRole} can={can} /> : <AccessDenied />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>

      <Dialog open={showSessionPrompt} onClose={handleLogout} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ color: '#0f172a' }}>Continue your session?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your session is still active, but you have been away for an hour. You have {sessionCountdown} seconds to choose. Continue this session or sign out now.
          </DialogContentText>
          <DialogContentText sx={{ mt: 1, color: '#7c2d12', fontWeight: 700 }}>
            Auto sign out in {sessionCountdown}s
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleLogout} color="secondary">Sign out</Button>
          <Button variant="contained" onClick={handleSessionContinue}>Continue</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default App;
