import { useState } from 'react';
import { Eye, EyeOff, LogIn, Shield, BookOpen } from 'lucide-react';
import { StudentProfile } from '../types';
import { STUDENTS } from '../data/mockData';

interface LoginPageProps {
  onLogin: (student: StudentProfile) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!studentId.trim() || !password.trim()) {
      setError('Sila masukkan ID Pelajar dan Kata Laluan.');
      return;
    }

    setLoading(true);

    // Simulate a brief auth check
    setTimeout(() => {
      const found = STUDENTS.find(
        s => s.id === studentId.trim().toUpperCase() && s.password === password.trim()
      );

      if (found) {
        onLogin(found);
      } else {
        setError('ID Pelajar atau Kata Laluan tidak sah. Sila cuba semula.');
        setLoading(false);
      }
    }, 800);
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #1a56db 50%, #0ea5e9 100%)' }}
    >
      {/* Top bar — exact DELIMa header style */}
      <header className="bg-white shadow-sm px-6 py-3 flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="font-black text-2xl tracking-tight">
            <span className="text-[#1a56db]">D</span>
            <span className="text-[#1a56db]">E</span>
            <span className="text-[#1a56db]">L</span>
            <span className="text-[#1a56db]">I</span>
            <span className="text-[#1a56db]">M</span>
            <span className="text-[#e02424]">a</span>
          </span>
        </div>
        <div className="h-6 w-px bg-gray-200" />
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Kementerian Pendidikan Malaysia
          </p>
          <p className="text-[9px] text-slate-400">Digital Learning in Malaysia</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2.5 py-1 rounded-full border border-blue-200">
            PRESTIJ Programme
          </span>
          <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-full border border-emerald-200">
            SBP Integrasi Kuantan
          </span>
        </div>
      </header>

      {/* Main login area */}
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">

          {/* School info card */}
          <div className="text-center mb-6">
            <div
              className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4 shadow-xl"
              style={{ background: 'linear-gradient(135deg, #fff 0%, #e0f2fe 100%)' }}
            >
              <BookOpen className="w-9 h-9 text-blue-600" />
            </div>
            <h1 className="text-2xl font-black text-white mb-1">
              Sistem Padanan Biasiswa A.I.
            </h1>
            <p className="text-blue-200 text-sm font-medium">
              Kelas Ibnu Khaldun — SBP Integrasi Kuantan
            </p>
            <p className="text-blue-300 text-xs mt-1">
              Sesi Peperiksaan 2025/2026
            </p>
          </div>

          {/* Login card */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">

            {/* Card header */}
            <div className="px-6 py-5" style={{ background: 'linear-gradient(135deg, #1e3a5f, #1a56db)' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-white font-black text-base">Log Masuk Pelajar</h2>
                  <p className="text-blue-200 text-xs">Gunakan ID & Kata Laluan yang diberikan</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">

              {/* ID field */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">
                  ID Pelajar
                </label>
                <input
                  type="text"
                  value={studentId}
                  onChange={e => setStudentId(e.target.value)}
                  placeholder="Contoh: SBP5IK001"
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 text-sm font-mono font-bold text-slate-700 placeholder-slate-300 focus:outline-none focus:border-blue-500 transition-colors"
                  style={{ letterSpacing: '0.05em' }}
                  autoComplete="username"
                  autoFocus
                />
              </div>

              {/* Password field */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">
                  Kata Laluan
                </label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Masukkan kata laluan"
                    className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-slate-200 text-sm font-mono font-bold text-slate-700 placeholder-slate-300 placeholder-font-sans focus:outline-none focus:border-blue-500 transition-colors"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl text-xs text-red-700 font-medium" style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
                  <span className="text-sm flex-shrink-0">⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-black text-white text-sm transition-all disabled:opacity-70"
                style={{ background: loading ? '#6b7280' : 'linear-gradient(135deg, #1e3a5f, #1a56db)' }}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Mengesahkan...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    Log Masuk
                  </>
                )}
              </button>

              {/* Privacy note */}
              <div className="flex items-start gap-2 pt-1">
                <Shield className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                <p className="text-[10px] text-slate-400 leading-snug">
                  ID & Kata Laluan adalah <span className="font-bold text-slate-500">SULIT</span>. Hanya data anda sendiri akan dipaparkan selepas log masuk. Sistem ini mematuhi PDPA 2010.
                </p>
              </div>
            </form>
          </div>

          {/* Badges */}
          <div className="flex items-center justify-center gap-2 mt-5 flex-wrap">
            {['KPM', 'DELIMa 2.0', 'PDPA', 'JPA', 'PRESTIJ'].map(b => (
              <span key={b} className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/20 text-white/80">
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-4 text-blue-300 text-[10px]">
        © 2025 Kementerian Pendidikan Malaysia · DELIMa Scholarship AI System v2.0
      </footer>
    </div>
  );
}
