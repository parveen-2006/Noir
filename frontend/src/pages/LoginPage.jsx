import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const initialForm = {
  email: '',
  password: '',
};

function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.email || !form.password) {
      setError('Email and password are required.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const result = await onLogin(form);
    setIsSubmitting(false);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.message || 'This user does not exist or the password is incorrect.');
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-slate-50 bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.14),transparent_35%)]">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl shadow-slate-200/70">
        <div className="mb-8 flex items-center gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-pink-500 text-lg font-bold text-white">
            N
          </div>
          <div>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-violet-300">Welcome</p>
            <h1 className="text-3xl font-bold text-slate-900">Login</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block text-sm text-slate-700">
            <span className="mb-2 block">Email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              autoComplete="email"
              className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            />
          </label>

          <label className="block text-sm text-slate-700">
            <span className="mb-2 block">Password</span>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="current-password"
              className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            />
          </label>

          {error && <p className="text-sm text-red-300">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
