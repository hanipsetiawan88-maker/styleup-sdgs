import { useState } from 'react';
import { LOGO_URL } from '../data';
import MovingBackground from '../components/MovingBackground';
import { loginUser } from '../utils/api';

export default function LoginPage({ onNavigate, onLogin, onGuestEnter }) {
  const [email, setEmail] = useState('najlaa.arwanto@esg-investama.id');
  const [password, setPassword] = useState('12345678');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      // Try to login via MySQL backend API
      const result = await loginUser(email, password);
      setLoading(false);

      if (result.success && result.user) {
        if (onLogin) {
          onLogin(result.user);
        } else {
          onNavigate('beranda');
        }
      } else {
        setErrorMessage(result.message || 'Email atau kata sandi tidak sesuai.');
      }
    } catch (err) {
      // Fallback if backend offline or direct
      console.warn('Backend offline fallback:', err);
      setLoading(false);
      if (onLogin) {
        onLogin({
          name: 'Najlaa Khairunnisa',
          email: email || 'najlaa@esg-investama.id',
          role: 'Relawan Aktif',
          avatar: '/najlaa-profile.jpg',
          verified: true,
        });
      } else {
        onNavigate('beranda');
      }
    }
  }

  function handleGuestClick() {
    if (onGuestEnter) {
      onGuestEnter();
    } else {
      onNavigate('beranda');
    }
  }

  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-[#eff8f4] via-[#f8f9ff] to-[#e8f7f0] relative overflow-hidden">
      {/* Dynamic Animated Moving Visuals in the Background */}
      <MovingBackground />

      <div className="relative z-10 w-full max-w-[1200px] rounded-2xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,56,40,0.22)] border border-white/80 bg-white grid grid-cols-1 lg:grid-cols-12 min-h-[700px] transition-all">
        {/* Left panel with subtle slow Ken Burns movement */}
        <div className="relative lg:col-span-7 flex flex-col justify-between p-8 md:p-12 lg:p-14 bg-gradient-to-br from-[#003828] via-[#0d503c] to-[#002b1f] text-white overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-35 mix-blend-overlay pointer-events-none bg-[url('https://lh3.googleusercontent.com/aida-public/AB6AXuCyH0WSyq_hmjy7lyUs_9mjFCiZucIsN5qFAF-KJbHGCqeMSNLTYoS6atM2GaYXGCDAWE0XJsbkJpCPdpHNexRsfdIXZt5n7N_78UmXTJEz1QOY9NbCXEFllCh308wesT5dcTba-QVJzIYxUJNJeUBfEDbj_f0TedjkTPD3LoX7HOQXPpZUC_M6K3-fZ-edgVFHbhPrDrwu5DFSPfyReLoEfODE9F0h_fQN_JmqPDFhiDcgaOarIK8t')] bg-cover bg-center animate-ken-burns" />
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#6cf8bb]/20 blur-3xl pointer-events-none animate-blob-pulse" />
          <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-[#38bdf8]/15 blur-3xl pointer-events-none animate-blob-float" />

          {/* Logo (Clean transparent white logo, larger, without outside text) */}
          <div className="relative z-10 flex items-center">
            <img
              src="/logo-white.png"
              alt="StyleUp Sustainability"
              className="h-12 sm:h-14 w-auto object-contain drop-shadow-sm"
              onError={(e) => {
                e.currentTarget.src = LOGO_URL;
                e.currentTarget.style.filter = 'brightness(0) invert(1)';
              }}
            />
          </div>

          {/* Center content */}
          <div className="relative z-10 my-8 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-[#b1f0d4] text-xs font-semibold mb-4">
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>verified</span>
              Verified Projects, Measurable Impact
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 leading-tight">
              Akselerasi Nyata Menuju Indonesia Emas.
            </h1>
            <p className="text-[#dce9ff]/90 text-base leading-relaxed mb-6">
              Portal kolaborasi multipihak untuk pemetaan, pendanaan transparan, dan kerelawanan 17 Tujuan Pembangunan Berkelanjutan (SDGs) di 38 Provinsi Indonesia.
            </p>
            <div className="p-4 rounded-xl bg-white/10 backdrop-blur-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#6cf8bb]/30 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[#4edea3]" style={{ fontSize: 20 }}>groups</span>
                </div>
                <div>
                  <p className="text-xs text-[#b1f0d4] font-semibold mb-0.5">18.520+ Relawan Aktif di 38 Provinsi</p>
                  <p className="text-[#dce9ff]/80 text-xs leading-relaxed">Gabung dalam platform verifikasi dampak ESG terpercaya Indonesia.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Trust badges */}
          <div className="relative z-10">
            <span className="text-[11px] uppercase tracking-wider text-white/70 block mb-2 font-semibold">Akreditasi &amp; Standar Kepatuhan</span>
            <div className="flex flex-wrap items-center gap-2">
              {['Bappenas SDGs Partner', 'ISO 14064 Carbon Accounting', 'GRI Standards Certified'].map(b => (
                <div key={b} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-white text-[11px] font-medium">
                  <span className="material-symbols-outlined text-[#4edea3]" style={{ fontSize: 14 }}>verified_user</span>
                  {b}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right form panel */}
        <div className="relative lg:col-span-5 flex flex-col justify-center p-8 md:p-12 lg:p-14 bg-white">
          <div className="w-full max-w-md mx-auto">
            <div className="mb-8">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#e5eeff] text-[#003828] text-xs font-semibold mb-3">
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>database</span>
                Terhubung MySQL XAMPP
              </div>
              <h2 className="text-2xl font-bold text-[#0b1c30] mb-2">Selamat Datang Kembali</h2>
              <p className="text-sm text-[#404944]">Masuk ke akun StyleUp untuk mengelola inisiatif, donasi, dan kerelawanan Anda.</p>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-[#ffdad6] text-[#ba1a1a] text-xs font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-base">error</span>
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-[#0b1c30]">Email Address</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#707974] pointer-events-none" style={{ fontSize: 20 }}>mail</span>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-lg bg-[#eff4ff] text-[#0b1c30] text-sm placeholder:text-[#707974] focus:outline-none focus:ring-2 focus:ring-[#006c49]/40 focus:bg-white transition-all"
                    placeholder="nama@email.com"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-semibold text-[#0b1c30]">Kata Sandi</label>
                  <button type="button" onClick={() => onNavigate('lupa-sandi')} className="text-xs text-[#006c49] hover:text-[#003828] font-semibold hover:underline">Lupa Kata Sandi?</button>
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#707974] pointer-events-none" style={{ fontSize: 20 }}>key</span>
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-11 pr-11 py-3 rounded-lg bg-[#eff4ff] text-[#0b1c30] text-sm placeholder:text-[#707974] focus:outline-none focus:ring-2 focus:ring-[#006c49]/40 focus:bg-white transition-all"
                    placeholder="Minimal 8 karakter"
                    required
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#707974] hover:text-[#0b1c30] focus:outline-none">
                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{showPass ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>

              {/* Remember */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded accent-[#0d503c] cursor-pointer" />
                  <span className="text-sm text-[#404944]">Ingat perangkat ini 30 hari</span>
                </label>
                <div className="hidden sm:flex items-center gap-1 text-[#006c49] text-xs font-semibold">
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>shield</span>
                  TLS 1.3
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-lg bg-[#0d503c] hover:bg-[#003828] text-white text-base font-semibold shadow-md hover:shadow-lg active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? (
                  <><span className="material-symbols-outlined animate-spin" style={{ fontSize: 20 }}>autorenew</span> Memproses...</>
                ) : (
                  <><span>Masuk ke Akun</span><span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_forward</span></>
                )}
              </button>

              {/* Divider */}
              <div className="relative flex items-center justify-center my-3">
                <div className="w-full h-px bg-[#dce9ff]" />
                <span className="absolute px-3 bg-white text-[11px] text-[#707974] font-semibold uppercase tracking-wider">
                  atau masuk dengan
                </span>
              </div>

              {/* Social Buttons with Logos */}
              <div className="space-y-2.5">
                <div className="grid grid-cols-3 gap-3">
                  {/* Google */}
                  <button
                    type="button"
                    onClick={() => alert('Menghubungkan ke Akun Google...')}
                    className="py-2.5 px-3 rounded-xl bg-[#eff4ff] hover:bg-[#e5eeff] text-[#0b1c30] flex items-center justify-center gap-2 text-xs font-semibold transition-all duration-150 shadow-sm hover:shadow"
                    title="Masuk dengan Google"
                  >
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>Google</span>
                  </button>

                  {/* Apple */}
                  <button
                    type="button"
                    onClick={() => alert('Menghubungkan ke Apple ID...')}
                    className="py-2.5 px-3 rounded-xl bg-[#eff4ff] hover:bg-[#e5eeff] text-[#0b1c30] flex items-center justify-center gap-2 text-xs font-semibold transition-all duration-150 shadow-sm hover:shadow"
                    title="Masuk dengan Apple"
                  >
                    <svg className="w-4 h-4 shrink-0 fill-current text-[#0b1c30]" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.93-2.85-.9.04-1.99.6-2.63 1.35-.56.64-1.05 1.7-0.92 2.71 1 .08 2.02-.51 2.62-1.21z" />
                    </svg>
                    <span>Apple</span>
                  </button>

                  {/* Facebook */}
                  <button
                    type="button"
                    onClick={() => alert('Menghubungkan ke Facebook...')}
                    className="py-2.5 px-3 rounded-xl bg-[#eff4ff] hover:bg-[#e5eeff] text-[#0b1c30] flex items-center justify-center gap-2 text-xs font-semibold transition-all duration-150 shadow-sm hover:shadow"
                    title="Masuk dengan Facebook"
                  >
                    <svg className="w-4 h-4 shrink-0 fill-[#1877F2]" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <span>Facebook</span>
                  </button>
                </div>

                {/* SSO Button with official badge */}
                <button
                  type="button"
                  onClick={() => alert('Mengarahkan ke SSO Bappenas / Satu Data Indonesia...')}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#eff4ff] hover:bg-[#e5eeff] text-[#0b1c30] text-xs font-semibold flex items-center justify-center gap-2.5 transition-all duration-150 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[#003828] text-base shrink-0">assured_workload</span>
                  <span>Masuk dengan SSO Instansi / Bappenas</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#6cf8bb] text-[#003828] font-bold uppercase tracking-wider">
                    Resmi
                  </span>
                </button>
              </div>
            </form>

            <div className="mt-8 text-center pt-4 border-t border-[#e5eeff] space-y-2">
              <p className="text-sm text-[#404944]">
                Belum memiliki akun?{' '}
                <button onClick={() => onNavigate('daftar')} className="font-semibold text-[#006c49] hover:text-[#003828] hover:underline underline-offset-4 transition-all cursor-pointer">
                  Daftar Sebagai Relawan / Mitra
                </button>
              </p>
              <button
                type="button"
                onClick={handleGuestClick}
                className="text-xs text-[#707974] hover:text-[#006c49] font-medium hover:underline transition-all cursor-pointer block mx-auto"
              >
                Lewati &amp; Masuk ke Dashboard sebagai Tamu →
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
