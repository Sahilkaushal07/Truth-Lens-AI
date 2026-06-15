import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Upload, ShieldCheck, AlertTriangle, Clock, TrendingUp, FileImage } from 'lucide-react';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const COLORS = { real: '#10b981', fake: '#f43f5e', unknown: '#6b7280' };

const StatCard = ({ icon, label, value, sub }) => (
  <div className="glass-card rounded-2xl p-5 flex items-center gap-4">
    <div className="w-11 h-11 rounded-xl bg-zinc-950 border border-cyber-border flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div>
      <p className="text-xl font-bold text-white">{value}</p>
      <p className="text-xs text-gray-400">{label}</p>
      {sub && <p className="text-[10px] text-gray-600 font-mono mt-0.5">{sub}</p>}
    </div>
  </div>
);

export default function Dashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, histRes] = await Promise.all([
          axios.get('/api/dashboard/stats'),
          axios.get('/api/history?limit=5'),
        ]);
        setStats(statsRes.data);
        setHistory(histRes.data.items || []);
        setChartData(statsRes.data.chartData || []);
      } catch {
        // Show empty state if API is unavailable
        setStats({ totalScans: 0, realCount: 0, fakeCount: 0, accuracy: 'N/A' });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-t-cyber-cyan border-cyber-border rounded-full animate-spin" />
          <p className="text-xs text-gray-500 font-mono">LOADING INTEL...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 w-full">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Welcome back, <span className="text-cyber-cyan">{user?.username}</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-mono">FORENSIC COMMAND CENTER</p>
        </div>
        <Link to="/upload" className="cyber-btn-cyan px-5 py-2.5 rounded-xl text-sm flex items-center gap-2">
          <Upload size={14} /> New Scan
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={<FileImage size={18} className="text-cyber-cyan" />} label="Total Scans" value={stats?.totalScans ?? 0} sub="all time" />
        <StatCard icon={<ShieldCheck size={18} className="text-cyber-emerald" />} label="Verified Real" value={stats?.realCount ?? 0} sub="authentic media" />
        <StatCard icon={<AlertTriangle size={18} className="text-cyber-rose" />} label="Deepfakes Found" value={stats?.fakeCount ?? 0} sub="synthetic detected" />
        <StatCard icon={<TrendingUp size={18} className="text-cyber-purple" />} label="Accuracy Rate" value={stats?.accuracy ?? 'N/A'} sub="avg confidence" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="glass-card rounded-2xl p-6 lg:col-span-2">
          <h2 className="text-sm font-semibold text-white mb-1">Weekly Scan Activity</h2>
          <p className="text-xs text-gray-500 mb-5 font-mono">DETECTION TREND — LAST 7 DAYS</p>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData} barGap={4}>
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#09090b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 11 }}
                  cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                />
                <Bar dataKey="real" name="Real" fill={COLORS.real} radius={[4, 4, 0, 0]} />
                <Bar dataKey="fake" name="Fake" fill={COLORS.fake} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-600 text-sm font-mono">
              NO SCAN DATA YET — RUN YOUR FIRST ANALYSIS
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="glass-card rounded-2xl p-6 flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-white">Quick Actions</h2>
          <Link to="/upload" className="flex items-center gap-3 p-3 rounded-xl border border-cyber-border hover:border-cyber-cyan/40 transition group">
            <Upload size={16} className="text-cyber-cyan" />
            <span className="text-sm text-gray-300 group-hover:text-white transition">Upload Media</span>
          </Link>
          <Link to="/upload" className="flex items-center gap-3 p-3 rounded-xl border border-cyber-border hover:border-cyber-purple/40 transition group">
            <ShieldCheck size={16} className="text-cyber-purple" />
            <span className="text-sm text-gray-300 group-hover:text-white transition">Scan URL</span>
          </Link>
        </div>
      </div>

      {/* Recent history */}
      <div className="mt-6 glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-semibold text-white">Recent Detections</h2>
          <span className="text-xs text-gray-500 font-mono flex items-center gap-1">
            <Clock size={10} /> LATEST 5
          </span>
        </div>
        {history.length === 0 ? (
          <div className="text-center py-10 text-gray-600 text-sm font-mono">
            NO SCANS YET — SUBMIT YOUR FIRST FILE ABOVE
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((item) => (
              <Link
                key={item._id}
                to={`/result/${item._id}`}
                className="flex items-center justify-between p-3 rounded-xl border border-cyber-border hover:border-cyber-cyan/30 transition group"
              >
                <div className="flex items-center gap-3">
                  <FileImage size={14} className="text-gray-500" />
                  <span className="text-sm text-gray-300 group-hover:text-white transition truncate max-w-xs">
                    {item.filename || item.url || 'Unknown file'}
                  </span>
                </div>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                    item.verdict === 'fake'
                      ? 'text-cyber-rose border-cyber-rose/30 bg-cyber-rose/10'
                      : item.verdict === 'real'
                      ? 'text-cyber-emerald border-cyber-emerald/30 bg-cyber-emerald/10'
                      : 'text-gray-400 border-gray-700 bg-gray-900'
                  }`}
                >
                  {(item.verdict || 'unknown').toUpperCase()}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
