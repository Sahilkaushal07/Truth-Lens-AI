import React, { useEffect, useState } from 'react';
import { Users, ShieldCheck, Activity, AlertTriangle, RefreshCw, Trash2 } from 'lucide-react';
import axios from 'axios';

const StatCard = ({ icon, label, value }) => (
  <div className="glass-card rounded-2xl p-5 flex items-center gap-4">
    <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-cyber-border flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div>
      <p className="text-lg font-bold text-white">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  </div>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes] = await Promise.all([
        axios.get('/api/admin/stats'),
        axios.get('/api/admin/users'),
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data.users || []);
    } catch {
      setStats({ totalUsers: 0, totalScans: 0, fakeDetected: 0, flagged: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await axios.delete(`/api/admin/users/${id}`);
      setUsers((u) => u.filter((x) => x._id !== id));
    } catch {
      alert('Failed to delete user.');
    }
  };

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-t-cyber-rose border-cyber-border rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 w-full">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Admin Console</h1>
          <p className="text-xs text-gray-500 font-mono mt-0.5">SYSTEM CONTROL — RESTRICTED ACCESS</p>
        </div>
        <button onClick={load} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white border border-cyber-border px-3 py-2 rounded-xl transition">
          <RefreshCw size={12} /> Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={<Users size={16} className="text-cyber-cyan" />} label="Total Users" value={stats?.totalUsers ?? 0} />
        <StatCard icon={<Activity size={16} className="text-cyber-purple" />} label="Total Scans" value={stats?.totalScans ?? 0} />
        <StatCard icon={<ShieldCheck size={16} className="text-cyber-emerald" />} label="Real Verified" value={stats?.realVerified ?? 0} />
        <StatCard icon={<AlertTriangle size={16} className="text-cyber-rose" />} label="Fakes Detected" value={stats?.fakeDetected ?? 0} />
      </div>

      {/* Users table */}
      <div className="glass-card rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-white mb-5">Registered Users</h2>
        {users.length === 0 ? (
          <p className="text-center text-gray-600 font-mono text-sm py-8">NO USERS FOUND</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[10px] font-mono text-gray-500 uppercase tracking-wider border-b border-cyber-border">
                  <th className="text-left pb-3 pr-4">Username</th>
                  <th className="text-left pb-3 pr-4">Email</th>
                  <th className="text-left pb-3 pr-4">Role</th>
                  <th className="text-left pb-3 pr-4">Scans</th>
                  <th className="text-left pb-3">Joined</th>
                  <th className="pb-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-cyber-border/50">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-white/[0.02] transition">
                    <td className="py-3 pr-4 font-medium text-white">{u.username}</td>
                    <td className="py-3 pr-4 text-gray-400">{u.email}</td>
                    <td className="py-3 pr-4">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-mono ${
                        u.role === 'admin'
                          ? 'text-cyber-rose border-cyber-rose/30 bg-cyber-rose/10'
                          : 'text-gray-400 border-gray-700 bg-zinc-900'
                      }`}>
                        {u.role?.toUpperCase() || 'USER'}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-gray-400">{u.scanCount ?? 0}</td>
                    <td className="py-3 text-gray-500 text-xs">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-3 pl-4">
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => deleteUser(u._id)}
                          className="text-gray-600 hover:text-cyber-rose transition"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
