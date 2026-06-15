import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err?.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center px-4 py-16 relative grid-scanner">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="glass-card rounded-3xl p-8 md:p-10">
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-cyber-cyan/10 border border-cyber-cyan/30 flex items-center justify-center mb-4">
              <Shield size={26} className="text-cyber-cyan" />
            </div>
            <h1 className="text-2xl font-bold text-white">Operator Access</h1>
            <p className="text-xs text-gray-500 mt-1 font-mono">TRUTHLENS AI — SECURE LOGIN</p>
          </div>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-cyber-rose/10 border border-cyber-rose/30 flex items-center gap-2 text-cyber-rose text-sm">
              <AlertCircle size={15} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-mono text-gray-400 mb-2 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="cyber-input w-full rounded-xl pl-10 pr-4 py-3 text-sm"
                  placeholder="operator@truthlens.ai"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-400 mb-2 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="cyber-input w-full rounded-xl pl-10 pr-4 py-3 text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="cyber-btn-cyan w-full rounded-xl py-3 text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <LogIn size={15} />
                  Access Platform
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            No account?{' '}
            <Link to="/signup" className="text-cyber-cyan hover:underline font-medium">
              Register operator ID
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
