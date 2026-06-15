import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Link2, X, FileImage, FileVideo, Cpu, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';

const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm', 'video/quicktime', 'audio/mpeg', 'audio/wav'];

export default function UploadCenter() {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState('');
  const [mode, setMode] = useState('file'); // 'file' | 'url'
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = (f) => {
    if (!ACCEPTED.includes(f.type)) {
      setError('Unsupported file type. Please upload an image, video, or audio file.');
      return;
    }
    setError('');
    setFile(f);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const onInputChange = (e) => {
    const f = e.target.files[0];
    if (f) handleFile(f);
  };

  const submit = async () => {
    setError('');
    if (mode === 'file' && !file) { setError('Please select a file.'); return; }
    if (mode === 'url' && !url.trim()) { setError('Please enter a URL.'); return; }

    setUploading(true);
    try {
      let res;
      if (mode === 'file') {
        const fd = new FormData();
        fd.append('media', file);
        res = await axios.post('/api/scan/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        res = await axios.post('/api/scan/url', { url: url.trim() });
      }
      navigate(`/result/${res.data.historyId}`);
    } catch (err) {
      setError(err?.response?.data?.message || 'Scan failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const fileIcon = file?.type?.startsWith('video') ? <FileVideo size={24} className="text-cyber-purple" /> : <FileImage size={24} className="text-cyber-cyan" />;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Forensic Scanner</h1>
        <p className="text-sm text-gray-500 font-mono">SUBMIT MEDIA FOR AI ANALYSIS</p>
      </div>

      {/* Mode tabs */}
      <div className="flex gap-1 p-1 bg-zinc-950 border border-cyber-border rounded-xl mb-6 w-fit">
        <button
          onClick={() => { setMode('file'); setError(''); }}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition ${mode === 'file' ? 'bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/30' : 'text-gray-500 hover:text-white'}`}
        >
          Upload File
        </button>
        <button
          onClick={() => { setMode('url'); setError(''); }}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition ${mode === 'url' ? 'bg-cyber-purple/20 text-cyber-purple border border-cyber-purple/30' : 'text-gray-500 hover:text-white'}`}
        >
          Scan URL
        </button>
      </div>

      {/* Upload area */}
      {mode === 'file' ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`relative glass-card rounded-2xl p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-all border-2 ${
            dragging ? 'border-cyber-cyan/60 bg-cyber-cyan/5' : file ? 'border-cyber-emerald/40' : 'border-cyber-border hover:border-cyber-cyan/30'
          }`}
        >
          <input ref={inputRef} type="file" accept={ACCEPTED.join(',')} className="hidden" onChange={onInputChange} />

          {file ? (
            <div className="flex flex-col items-center gap-3">
              {fileIcon}
              <p className="text-sm font-medium text-white break-all px-4">{file.name}</p>
              <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              <button
                onClick={(e) => { e.stopPropagation(); setFile(null); }}
                className="mt-2 flex items-center gap-1 text-xs text-cyber-rose hover:underline"
              >
                <X size={12} /> Remove
              </button>
            </div>
          ) : (
            <>
              <div className="w-16 h-16 rounded-2xl bg-zinc-950 border border-cyber-border flex items-center justify-center mb-5">
                <Upload size={24} className="text-gray-400" />
              </div>
              <p className="text-white font-semibold mb-1">Drop file here or click to browse</p>
              <p className="text-xs text-gray-500 mt-1">Images (JPEG, PNG, WebP, GIF), Video (MP4, WebM, MOV), Audio (MP3, WAV)</p>
              <p className="text-xs text-gray-600 mt-3 font-mono">MAX SIZE: 50MB</p>
            </>
          )}
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-8">
          <label className="block text-xs font-mono text-gray-400 mb-3 uppercase tracking-wider">Media URL</label>
          <div className="relative">
            <Link2 size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="cyber-input w-full rounded-xl pl-10 pr-4 py-3 text-sm"
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <p className="mt-3 text-xs text-gray-500">Supports direct image/video URLs, Twitter/X media, YouTube, and more.</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-4 px-4 py-3 rounded-xl bg-cyber-rose/10 border border-cyber-rose/30 flex items-center gap-2 text-cyber-rose text-sm">
          <AlertCircle size={14} />
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        onClick={submit}
        disabled={uploading || (mode === 'file' && !file) || (mode === 'url' && !url.trim())}
        className="mt-6 cyber-btn-cyan w-full rounded-xl py-3.5 text-sm flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {uploading ? (
          <>
            <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            Analyzing media...
          </>
        ) : (
          <>
            <Cpu size={15} /> Launch Forensic Scan
          </>
        )}
      </button>

      {/* Info footer */}
      <div className="mt-8 grid grid-cols-3 gap-3 text-center">
        {[
          { icon: <CheckCircle size={13} className="text-cyber-emerald" />, text: 'End-to-end encrypted' },
          { icon: <CheckCircle size={13} className="text-cyber-emerald" />, text: 'Files auto-deleted after scan' },
          { icon: <CheckCircle size={13} className="text-cyber-emerald" />, text: 'GDPR compliant' },
        ].map(({ icon, text }) => (
          <div key={text} className="flex items-center justify-center gap-1.5 text-xs text-gray-500">
            {icon} {text}
          </div>
        ))}
      </div>
    </div>
  );
}
