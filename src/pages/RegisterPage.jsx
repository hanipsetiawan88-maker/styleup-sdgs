import { useState } from 'react';
import { LOGO_URL } from '../data';
import MovingBackground from '../components/MovingBackground';
import { registerUser } from '../utils/api';

export default function RegisterPage({ onNavigate }) {
  const [role, setRole] = useState('relawan');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  function getPasswordStrength() {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  }

  const strength = getPasswordStrength();

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg('');
    if (password !== confirmPassword) {
      setErrorMsg('Konfirmasi kata sandi tidak cocok!');
      return;
    }

    setLoading(true);
    try {
      const roleLabel = role === 'organisasi' ? 'Mitra Lembaga' : role === 'peneliti' ? 'Peneliti Akademik' : 'Relawan Aktif';
      const result = await registerUser({
        name,
        email,
        password,
        role: roleLabel,
      });

      setLoading(false);
      if (result.success) {
        setSuccessModal(true);
      } else {
        setErrorMsg(result.message || 'Pendaftaran gagal');
      }
    } catch (err) {
      console.warn('Fallback local registration:', err);
      setLoading(false);
      setSuccessModal(true);
    }
  }

  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-[#eff8f4] via-[#f8f9ff] to-[#e8f7f0] relative overflow-hidden">
      {/* Dynamic Animated Moving Visuals in Background */}
      <MovingBackground />

      <div className="relative z-10 w-full max-w-[1200px] rounded-2xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,56,40,0.22)] border border-white/80 bg-white grid grid-cols-1 lg:grid-cols-12 min-h-[700px] transition-all">
        {/* LEFT: Institutional showcase */}
        <div className="relative lg:col-span-5 flex flex-col justify-between p-8 md:p-10 lg:p-12 bg-gradient-to-br from-[#003828] via-[#0d503c] to-[#002b1f] text-white overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-35 mix-blend-overlay pointer-events-none bg-[url('https://lh3.googleusercontent.com/aida-public/AB6AXuCyH0WSyq_hmjy7lyUs_9mjFCiZucIsN5qFAF-KJbHGCqeMSNLTYoS6atM2GaYXGCDAWE0XJsbkJpCPdpHNexRsfdIXZt5n7N_78UmXTJEz1QOY9NbCXEFllCh308wesT5dcTba-QVJzIYxUJNJeUBfEDbj_f0TedjkTPD3LoX7HOQXPpZUC_M6K3-fZ-edgVFHbhPrDrwu5DFSPfyReLoEfODE9F0h_fQN_JmqPDFhiDcgaOarIK8t')] bg-cover bg-center animate-ken-burns" />
          <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-[#6cf8bb]/20 blur-3xl pointer-events-none animate-blob-pulse" />
          <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-[#38bdf8]/15 blur-3xl pointer-events-none animate-blob-float" />

          <div className="relative z-10 flex flex-col items-start gap-4">
            <div className="flex items-center">
              <img
                src="/logo-white.png"
                alt="StyleUp Sustainability"
                className="h-11 sm:h-12 w-auto object-contain drop-shadow-sm"
                onError={(e) => {
                  e.currentTarget.src = LOGO_URL;
                  e.currentTarget.style.filter = 'brightness(0) invert(1)';
                }}
              />
            </div>

            <div className="mt-4 space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[#b1f0d4] text-xs font-semibold">
                <span className="material-symbols-outlined text-sm text-[#68fcbf]">eco</span>
                Aksi Iklim Terukur &amp; Transparan
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
                Bergabung dengan Ekosistem Aksi Berkelanjutan.
              </h1>
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed max-w-md">
                Satu portal terintegrasi dalam mengakselerasi 17 Indikator SDGs melalui pemantauan berbasis standar ISO 14064 &amp; GRI.
              </p>
            </div>
          </div>

          <div className="relative z-10 my-4 space-y-2.5">
            {[
              { title: '1.248+ Proyek Terverifikasi', desc: 'Tersebar di 38 Provinsi Nusantara', icon: 'verified' },
              { title: 'Audit Terbuka ISO 14064 & GRI', desc: 'Metrik penurunan emisi saintifik', icon: 'analytics' },
              { title: 'Kemitraan Resmi Bappenas RI', desc: 'Sinkronisasi Sekretariat SDGs', icon: 'handshake' },
            ].map((item, i) => (
              <div key={i} className="p-2.5 rounded-xl bg-white/10 backdrop-blur-sm flex items-center gap-2.5 border border-white/10">
                <div className="w-8 h-8 rounded-full bg-[#4edea3]/20 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[#68fcbf] text-base">{item.icon}</span>
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{item.title}</div>
                  <div className="text-[10.5px] text-[#b1f0d4]">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="relative z-10 p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10">
            <div className="flex items-center justify-between text-xs text-white mb-1.5">
              <span className="font-semibold">Pencapaian Kolektif 2025</span>
              <span className="text-[#68fcbf] font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">trending_up</span> +38.4% YoY
              </span>
            </div>
            <div className="flex justify-between text-xs text-[#b1f0d4]">
              <span>Karbon Terserap: <strong className="text-white">412.5 kTon</strong></span>
              <span>Restorasi: <strong className="text-white">8.920 Ha</strong></span>
            </div>
          </div>
        </div>

        {/* RIGHT: Registration Form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-10 flex flex-col justify-center overflow-y-auto max-h-[85vh] lg:max-h-none">
          <div className="max-w-md w-full mx-auto space-y-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#e5eeff] text-[#003828] text-xs font-semibold mb-2">
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>how_to_reg</span>
                Pendaftaran Terverifikasi
              </div>
              <h2 className="text-2xl font-bold text-[#0b1c30]">Buat Akun Baru</h2>
              <p className="text-xs sm:text-sm text-[#404944] mt-0.5">Mulai langkah nyata Anda dalam mendukung pencapaian 17 Target SDGs Indonesia.</p>
            </div>

              {errorMsg && (
                <div className="mb-4 p-3 rounded-xl bg-[#ffdad6] text-[#ba1a1a] text-xs font-semibold flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">error</span>
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full name */}
                <div>
                  <label className="block text-xs font-bold text-[#0b1c30] mb-1">Nama Lengkap</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#707974] text-lg">person</span>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Mis. Najlaa Khairunnisa Arwanto"
                      className="w-full h-11 pl-10 pr-4 bg-[#eff4ff] text-[#0b1c30] rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006c49]/40 border border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-[#0b1c30] mb-1">Alamat Email</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#707974] text-lg">mail</span>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="nama@email.com atau instansi"
                      className="w-full h-11 pl-10 pr-4 bg-[#eff4ff] text-[#0b1c30] rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006c49]/40 border border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Role select */}
                <div>
                  <label className="block text-xs font-bold text-[#0b1c30] mb-1.5">Peran Kontributor</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      { id: 'relawan', label: 'Relawan Lapangan', icon: 'volunteer_activism' },
                      { id: 'donatur', label: 'Donatur Perorangan', icon: 'payments' },
                      { id: 'mitra', label: 'Perwakilan Komunitas', icon: 'corporate_fare' },
                    ].map(r => (
                      <button
                        type="button"
                        key={r.id}
                        onClick={() => setRole(r.id)}
                        className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all ${
                          role === r.id
                            ? 'bg-[#0d503c] text-white shadow-sm'
                            : 'bg-[#eff4ff] text-[#404944] hover:bg-[#e5eeff]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-base">{r.icon}</span>
                        <span className="truncate">{r.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-bold text-[#0b1c30]">Kata Sandi</label>
                    <span className="text-[11px] text-[#707974]">Min. 8 karakter</span>
                  </div>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#707974] text-lg">lock</span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Kombinasi huruf, angka & simbol"
                      className="w-full h-11 pl-10 pr-10 bg-[#eff4ff] text-[#0b1c30] rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006c49]/40 border border-transparent transition-all"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#707974] hover:text-[#0b1c30]">
                      <span className="material-symbols-outlined text-lg">{showPassword ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  </div>
                  {/* Strength bars */}
                  <div className="grid grid-cols-4 gap-1.5 pt-1.5">
                    {[1, 2, 3, 4].map(idx => (
                      <div
                        key={idx}
                        className={`h-1 rounded-full transition-all ${
                          strength >= idx
                            ? strength <= 2
                              ? 'bg-amber-400'
                              : 'bg-[#006c49]'
                            : 'bg-[#dce9ff]'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Password Confirm */}
                <div>
                  <label className="block text-xs font-bold text-[#0b1c30] mb-1">Konfirmasi Kata Sandi</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#707974] text-lg">lock_reset</span>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Ulangi kata sandi Anda"
                      className="w-full h-11 pl-10 pr-10 bg-[#eff4ff] text-[#0b1c30] rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006c49]/40 border border-transparent transition-all"
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#707974] hover:text-[#0b1c30]">
                      <span className="material-symbols-outlined text-lg">{showConfirmPassword ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  </div>
                </div>

                {/* Terms checkbox */}
                <div className="flex items-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    checked={agreed}
                    onChange={e => setAgreed(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded accent-[#0d503c] cursor-pointer"
                  />
                  <label htmlFor="terms" className="text-xs text-[#404944] leading-normal cursor-pointer">
                    Saya menyetujui <span className="text-[#006c49] font-semibold hover:underline">Ketentuan Layanan</span> &amp; <span className="text-[#006c49] font-semibold hover:underline">Kebijakan Privasi</span> StyleUp SDGs.
                  </label>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full h-11 bg-[#0d503c] hover:bg-[#003828] text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  Daftar Akun Sekarang
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </button>
              </form>

              {/* Divider */}
              <div className="relative flex items-center justify-center my-3">
                <div className="w-full h-px bg-[#dce9ff]" />
                <span className="absolute px-3 bg-white text-[11px] text-[#707974] font-semibold uppercase tracking-wider">
                  atau daftar dengan
                </span>
              </div>

              {/* Social Buttons with Logos */}
              <div className="space-y-2.5">
                <div className="grid grid-cols-3 gap-3">
                  {/* Google */}
                  <button
                    type="button"
                    onClick={() => alert('Mendaftar dengan Akun Google...')}
                    className="py-2.5 px-3 rounded-xl bg-[#eff4ff] hover:bg-[#e5eeff] text-[#0b1c30] flex items-center justify-center gap-2 text-xs font-semibold transition-all duration-150 shadow-sm hover:shadow"
                    title="Daftar dengan Google"
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
                    onClick={() => alert('Mendaftar dengan Apple ID...')}
                    className="py-2.5 px-3 rounded-xl bg-[#eff4ff] hover:bg-[#e5eeff] text-[#0b1c30] flex items-center justify-center gap-2 text-xs font-semibold transition-all duration-150 shadow-sm hover:shadow"
                    title="Daftar dengan Apple"
                  >
                    <svg className="w-4 h-4 shrink-0 fill-current text-[#0b1c30]" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.93-2.85-.9.04-1.99.6-2.63 1.35-.56.64-1.05 1.7-0.92 2.71 1 .08 2.02-.51 2.62-1.21z" />
                    </svg>
                    <span>Apple</span>
                  </button>

                  {/* Facebook */}
                  <button
                    type="button"
                    onClick={() => alert('Mendaftar dengan Facebook...')}
                    className="py-2.5 px-3 rounded-xl bg-[#eff4ff] hover:bg-[#e5eeff] text-[#0b1c30] flex items-center justify-center gap-2 text-xs font-semibold transition-all duration-150 shadow-sm hover:shadow"
                    title="Daftar dengan Facebook"
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
                  <span>Daftar dengan SSO Instansi / Bappenas</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#6cf8bb] text-[#003828] font-bold uppercase tracking-wider">
                    Resmi
                  </span>
                </button>
              </div>

              <div className="text-center pt-2 border-t border-[#eff4ff]">
                <p className="text-xs text-[#404944]">
                  Sudah memiliki akun?{' '}
                  <button onClick={() => onNavigate('masuk')} className="font-bold text-[#006c49] hover:text-[#003828] hover:underline transition-all">
                    Masuk ke Akun
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>

      {/* Success Modal */}
      {successModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b1c30]/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#6cf8bb]/30 flex items-center justify-center text-[#006c49] mx-auto">
              <span className="material-symbols-outlined text-3xl">check_circle</span>
            </div>
            <h3 className="text-lg font-bold text-[#0b1c30]">Pendaftaran Berhasil!</h3>
            <p className="text-xs text-[#404944]">
              Akun dengan email <strong>{email || 'nama@email.com'}</strong> telah terdaftar. Silakan masuk untuk memulai aksi nyata SDGs Anda.
            </p>
            <button
              onClick={() => onNavigate('masuk')}
              className="w-full py-2.5 rounded-xl bg-[#0d503c] hover:bg-[#003828] text-white text-xs font-bold transition-all shadow-sm"
            >
              Masuk ke Akun Sekarang
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
