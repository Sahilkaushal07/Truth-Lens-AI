import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Zap, Eye, Lock, ArrowRight, CheckCircle, Cpu, Globe, FileImage, FileVideo } from 'lucide-react';
import { motion } from 'framer-motion';

const FEATURES = [
  {
    icon: <Eye size={22} className="text-cyber-cyan" />,
    title: 'Deepfake Detection',
    desc: 'Multi-layered neural forensics detect manipulated faces, voices, and synthetic media with state-of-the-art accuracy.',
  },
  {
    icon: <Zap size={22} className="text-cyber-purple" />,
    title: 'Real-Time Analysis',
    desc: 'Sub-second inference pipeline powered by edge inference nodes. Results in milliseconds, not minutes.',
  },
  {
    icon: <Lock size={22} className="text-cyber-emerald" />,
    title: 'Forensic Audit Trail',
    desc: 'Every scan is cryptographically logged. Full chain-of-custody from upload to verdict.',
  },
  {
    icon: <Globe size={22} className="text-cyber-rose" />,
    title: 'Multi-Modal Support',
    desc: 'Analyze images, videos, audio clips, and URLs. Unified verdict engine across all media types.',
  },
];

const STATS = [
  { value: '99.2%', label: 'Detection accuracy' },
  { value: '<500ms', label: 'Avg. scan time' },
  { value: '12M+', label: 'Media items verified' },
  { value: '340+', label: 'Attack vectors covered' },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Upload Media', desc: 'Submit an image, video, audio, or paste a URL to scan.', icon: <FileImage size={18} /> },
  { step: '02', title: 'AI Forensics', desc: 'Proprietary models scan for synthetic artifacts, inconsistencies, and manipulation signatures.', icon: <Cpu size={18} /> },
  { step: '03', title: 'Verdict + Evidence', desc: 'Receive a confidence-scored verdict with highlighted evidence regions.', icon: <Shield size={18} /> },
];

export default function LandingPage() {
  return (
    <div className="w-full overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-[88vh] flex flex-col items-center justify-center px-4 pt-16 pb-24 grid-scanner text-center">
        <div className="absolute inset-0 bg-neon-glow pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-4xl mx-auto"
        >
          <span className="inline-block mb-5 px-4 py-1.5 rounded-full border border-cyber-cyan/30 bg-cyber-cyan/10 text-cyber-cyan text-xs font-mono tracking-widest">
            FORENSIC DEEPFAKE SIGNAL AUDITING
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight mb-6">
            Truth in Every{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan to-cyber-purple">
              Pixel
            </span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            TruthLens AI deploys military-grade forensic models to expose deepfakes, synthetic media, and AI-generated disinformation — in real time.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/signup" className="cyber-btn-cyan px-8 py-3 rounded-xl text-sm flex items-center gap-2">
              Start Free Analysis <ArrowRight size={16} />
            </Link>
            <Link to="/login" className="px-8 py-3 rounded-xl border border-cyber-border hover:border-cyber-cyan/40 text-sm transition text-gray-300">
              Sign In
            </Link>
          </div>
        </motion.div>

        {/* Floating badge row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="relative z-10 mt-16 flex flex-wrap justify-center gap-3"
        >
          {['Image Forensics', 'Video Auth', 'Voice Verify', 'URL Scanner', 'GAN Detection'].map((tag) => (
            <span key={tag} className="px-3 py-1 text-[11px] font-mono border border-cyber-border rounded-full text-gray-400 bg-zinc-950/60">
              {tag}
            </span>
          ))}
        </motion.div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-cyber-border bg-zinc-950/60 py-10">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 px-6 text-center">
          {STATS.map(({ value, label }) => (
            <div key={label}>
              <p className="text-3xl font-extrabold text-cyber-cyan">{value}</p>
              <p className="text-xs text-gray-500 mt-1 font-mono uppercase tracking-wider">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold mb-3">Platform Capabilities</h2>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">Everything needed to verify media authenticity at scale.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="glass-card glass-card-hover rounded-2xl p-6 flex gap-4">
              <div className="mt-0.5 shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-zinc-950 border border-cyber-border">
                {f.icon}
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">{f.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6 border-t border-cyber-border bg-zinc-950/40">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold mb-3">How It Works</h2>
            <p className="text-gray-500 text-sm">Three steps to forensic certainty.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map(({ step, title, desc, icon }) => (
              <div key={step} className="glass-card rounded-2xl p-7 text-center relative">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-cyber-cyan text-black text-[10px] font-mono font-bold">
                  STEP {step}
                </span>
                <div className="w-12 h-12 rounded-2xl bg-zinc-950 border border-cyber-border flex items-center justify-center mx-auto mb-4 text-cyber-cyan">
                  {icon}
                </div>
                <h3 className="font-semibold text-white mb-2">{title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-2xl mx-auto glass-card rounded-3xl p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyber-cyan/5 to-cyber-purple/5 pointer-events-none" />
          <Shield size={36} className="text-cyber-cyan mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Verify Media. Protect Truth.</h2>
          <p className="text-gray-400 text-sm mb-8 max-w-md mx-auto">
            Join thousands of journalists, researchers, and security teams who rely on TruthLens AI every day.
          </p>
          <Link to="/signup" className="cyber-btn-cyan px-10 py-3 rounded-xl text-sm inline-flex items-center gap-2">
            Create Free Account <ArrowRight size={15} />
          </Link>
          <ul className="mt-6 flex flex-wrap justify-center gap-4 text-xs text-gray-500">
            {['No credit card', 'Instant access', 'GDPR compliant'].map((t) => (
              <li key={t} className="flex items-center gap-1">
                <CheckCircle size={12} className="text-cyber-emerald" /> {t}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
