import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Shield, Clock, FileImage, Edit2, Save, X } from 'lucide-react';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState(user?.username || '');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  useEffect(() => {
    axios.get('/api/history?limit=10')
      .then(({ data }) => setHistory(data.items || []))
      .catch(() => setHistory([]))
      .finally(() => setLoading(false));
  }, []);

  const saveUsername = async () => {
    if (!username.trim()) return;
    setSaving(true);
    try {
      await axios.patch('/api/auth/profile', { username: username.trim() });
      setSaveMsg('Username updated.');
      setEditing(false);
      setTimeout(() => setSaveMsg(''), 3000);
    } catch {
      setSaveMsg('Failed to update.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Profile</h1>
        <p className="text-xs text-gray-500 font-mono mt-0.5">OPERATOR ACCOUNT SETTINGS</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile card */}
        <div className="glass-card rounded-2xl p-7 flex flex-col items-center text-center gap-3">
          <div className="w-20 h-20 rounded-2xl bg-cyber-cyan/10 border border-cyber-cyan/30 flex items-center justify-center">
            <User size={32} className="text-cyber-cyan" />
          </div>

          {editing ? (
            <div className="w-full">
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="cyber-input w-full rounded-xl px-3 py-2 text-sm text-center"
              />
              <div className="flex gap-2 mt-2">
                <button onClick={saveUsername} disabled={saving} className="flex-1 cyber-btn-cyan rounded-lg py-1.5 text-xs flex items-center justify-center gap-1">
                  <Save size={11} /> Save
                </button>
                <button onClick={() => { setEditing(false); setUsername(user?.username || ''); }} className="flex-1 rounded-lg py-1.5 text-xs border border-cyber-border text-gray-400 hover:text-white transition flex items-center justify-center gap-1">
                  <X size={11} /> Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <p className="font-bold text-white text-lg">{user?.username}</p>
              <button onClick={() => setEditing(true)} className="text-gray-600 hover:text-cyber-cyan transition">
                <Edit2 size={13} />
              </button>
            </div>
          )}

          {saveMsg && <p className="text-xs text-cyber-emerald font-mono">{saveMsg}</p>}

          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Mail size={13} className="text-gray-500" />
            {user?.email || 'No email'}
          </div>

          <span className={`text-[10px] px-3 py-1 rounded-full border font-mono ${
            user?.role === 'admin'
              ? 'text-cyber-rose border-cyber-rose/30 bg-cyber-rose/10'
              : 'text-cyber-cyan border-cyber-cyan/30 bg-cyber-cyan/10'
          }`}>
            {(user?.role || 'user').toUpperCase()}
          </span>

          <button
            onClick={logout}
            className="mt-4 w-full py-2 rounded-xl border border-cyber-border text-sm text-gray-400 hover:border-cyber-rose/40 hover:text-cyber-rose transition"
          >
            Sign Out
          </button>
        </div>

        {/* Scan history */}
        <div className="glass-card rounded-2xl p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold text-white">Scan History</h2>
            <span className="text-[10px] font-mono text-gray-500 flex items-center gap-1">
              <Clock size={9} /> LAST 10
            </span>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-2 border-t-cyber-cyan border-cyber-border rounded-full animate-spin" />
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-10 text-gray-600 font-mono text-sm">
              NO SCANS YET
              <div className="mt-3">
                <Link to="/upload" className="text-cyber-cyan text-xs hover:underline">Start your first scan →</Link>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {history.map((item) => (
                <Link
                  key={item._id}
                  to={`/result/${item._id}`}
                  className="flex items-center justify-between p-3 rounded-xl border border-cyber-border hover:border-cyber-cyan/30 transition group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileImage size={13} className="text-gray-500 shrink-0" />
                    <span className="text-sm text-gray-300 group-hover:text-white truncate transition">
                      {item.filename || item.url || item._id}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-3">
                    <span className="text-[10px] text-gray-500">
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                      item.verdict === 'fake'
                        ? 'text-cyber-rose border-cyber-rose/30 bg-cyber-rose/10'
                        : item.verdict === 'real'
                        ? 'text-cyber-emerald border-cyber-emerald/30 bg-cyber-emerald/10'
                        : 'text-gray-400 border-gray-700'
                    }`}>
                      {(item.verdict || 'N/A').toUpperCase()}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
