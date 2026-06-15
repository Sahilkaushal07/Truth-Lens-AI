import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, User, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function SignupPage() {
  const navigate = useNavigate();
  const signup = useAuthStore((s) => s.signup);
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      await signup(form.username, form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err?.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  return (
    <div className="flex-grow flex items-center justify-center px-4 py-16 relative grid-scanner">
      <div className="w-full max-w-md">
        <div className="glass-card rounded-3xl p-8 md:p-10">
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-cyber-purple/10 border border-cyber-purple/30 flex items-center justify-center mb-4">
              <Shield size={26} className="text-cyber-purple" />
            </div>
            <h1 className="text-2xl font-bold text-white">Register Operator</h1>
            <p className="text-xs text-gray-500 mt-1 font-mono">TRUTHLENS AI — NEW ACCOUNT</p>
          </div>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-cyber-rose/10 border border-cyber-rose/30 flex items-center gap-2 text-cyber-rose text-sm">
              <AlertCircle size={15} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-gray-400 mb-2 uppercase tracking-wider">Username</label>
              <div className="relative">
                <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  required
                  value={form.username}
                  onChange={update('username')}
                  className="cyber-input w-full rounded-xl pl-10 pr-4 py-3 text-sm"
                  placeholder="operator_id"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-400 mb-2 uppercase tracking-wider">Email</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={update('email')}
                  className="cyber-input w-full rounded-xl pl-10 pr-4 py-3 text-sm"
                  placeholder="you@domain.com"
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
                  value={form.password}
                  onChange={update('password')}
                  className="cyber-input w-full rounded-xl pl-10 pr-4 py-3 text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-400 mb-2 uppercase tracking-wider">Confirm Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  required
                  value={form.confirm}
                  onChange={update('confirm')}
                  className="cyber-input w-full rounded-xl pl-10 pr-4 py-3 text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="cyber-btn-purple w-full rounded-xl py-3 text-sm flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Operator Account'
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already registered?{' '}
            <Link to="/login" className="text-cyber-cyan hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
