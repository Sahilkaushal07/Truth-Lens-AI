import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Shield, ShieldOff, AlertTriangle, ArrowLeft, Clock, FileImage, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';

const ConfidenceBar = ({ value, color }) => (
  <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
    <div
      className="h-full rounded-full transition-all duration-700"
      style={{ width: `${value}%`, background: color }}
    />
  </div>
);

const VERDICT_CONFIG = {
  fake: {
    icon: <ShieldOff size={28} className="text-cyber-rose" />,
    label: 'SYNTHETIC / MANIPULATED',
    color: 'cyber-rose',
    bg: 'bg-cyber-rose/10',
    border: 'border-cyber-rose/30',
    text: 'text-cyber-rose',
    barColor: '#f43f5e',
  },
  real: {
    icon: <Shield size={28} className="text-cyber-emerald" />,
    label: 'AUTHENTIC MEDIA',
    color: 'cyber-emerald',
    bg: 'bg-cyber-emerald/10',
    border: 'border-cyber-emerald/30',
    text: 'text-cyber-emerald',
    barColor: '#10b981',
  },
  unknown: {
    icon: <AlertTriangle size={28} className="text-yellow-400" />,
    label: 'INCONCLUSIVE',
    color: 'yellow-400',
    bg: 'bg-yellow-400/10',
    border: 'border-yellow-400/30',
    text: 'text-yellow-400',
    barColor: '#facc15',
  },
};

export default function DetectionResult() {
  const { historyId } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axios.get(`/api/history/${historyId}`);
        setResult(data);
      } catch {
        setError('Result not found or has expired.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [historyId]);

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-t-cyber-cyan border-cyber-border rounded-full animate-spin" />
          <p className="text-xs text-gray-500 font-mono">RETRIEVING FORENSIC DATA...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center gap-4 px-4">
        <AlertTriangle size={32} className="text-cyber-rose" />
        <p className="text-cyber-rose font-mono text-sm">{error}</p>
        <Link to="/dashboard" className="text-xs text-cyber-cyan hover:underline">← Back to Dashboard</Link>
      </div>
    );
  }

  const cfg = VERDICT_CONFIG[result?.verdict] || VERDICT_CONFIG.unknown;
  const confidence = result?.confidence ?? 0;
  const signals = result?.signals || [];

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 w-full">
      <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-white transition mb-6">
        <ArrowLeft size={12} /> Dashboard
      </Link>

      {/* Verdict card */}
      <div className={`glass-card rounded-2xl p-8 mb-6 border ${cfg.border} ${cfg.bg}`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border ${cfg.border} bg-zinc-950 shrink-0`}>
            {cfg.icon}
          </div>
          <div className="flex-1">
            <p className={`text-xs font-mono ${cfg.text} mb-1`}>FORENSIC VERDICT</p>
            <h1 className={`text-2xl font-extrabold ${cfg.text}`}>{cfg.label}</h1>
            <p className="text-sm text-gray-400 mt-1">
              Confidence: <span className="font-semibold text-white">{confidence}%</span>
            </p>
            <div className="mt-2 max-w-xs">
              <ConfidenceBar value={confidence} color={cfg.barColor} />
            </div>
          </div>
        </div>
      </div>

      {/* Meta */}
      <div className="glass-card rounded-2xl p-6 mb-6">
        <h2 className="text-sm font-semibold text-white mb-4">Scan Details</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { label: 'File / URL', value: result?.filename || result?.url || historyId },
            { label: 'Media Type', value: result?.mediaType || 'Unknown' },
            { label: 'Scanned At', value: result?.createdAt ? new Date(result.createdAt).toLocaleString() : 'N/A' },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-0.5">{label}</p>
              <p className="text-sm text-gray-200 break-all">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Signal breakdown */}
      {signals.length > 0 && (
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-white mb-5">Signal Analysis</h2>
          <div className="space-y-4">
            {signals.map(({ name, score, suspicious }) => (
              <div key={name}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    {suspicious
                      ? <XCircle size={13} className="text-cyber-rose shrink-0" />
                      : <CheckCircle size={13} className="text-cyber-emerald shrink-0" />}
                    <span className="text-sm text-gray-300">{name}</span>
                  </div>
                  <span className="text-xs font-mono text-gray-400">{score}%</span>
                </div>
                <ConfidenceBar value={score} color={suspicious ? '#f43f5e' : '#10b981'} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="mt-6 flex flex-wrap gap-3">
        <Link to="/upload" className="cyber-btn-cyan px-6 py-2.5 rounded-xl text-sm flex items-center gap-2">
          <FileImage size={14} /> Scan Another
        </Link>
        <Link to="/dashboard" className="px-6 py-2.5 rounded-xl border border-cyber-border text-sm text-gray-300 hover:border-cyber-cyan/40 transition">
          Dashboard
        </Link>
      </div>
    </div>
  );
}
