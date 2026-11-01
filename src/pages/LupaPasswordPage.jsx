import { useState, useEffect } from 'react';
import { LOGO_URL } from '../data';
import MovingBackground from '../components/MovingBackground';

export default function LupaPasswordPage({ onNavigate }) {
  const [channel, setChannel] = useState('email'); // 'email' | 'wa'
  const [identifier, setIdentifier] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (timerActive && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((c) => c - 1);
      }, 1000);
    } else if (countdown === 0) {
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, countdown]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!identifier) return;
    setSubmitted(true);
    setCountdown(60);
    setTimerActive(true);
  }

  function handleResend() {
    setCountdown(60);
    setTimerActive(true);
  }

  return (
    <main className="min-h-screen w-full flex flex-col justify-center items-center p-4 sm:p-6 bg-gradient-to-br from-[#eff8f4] via-[#f8f9ff] to-[#e8f7f0] relative overflow-hidden">
      {/* Dynamic Animated Moving Visuals in Background */}
      <MovingBackground />

      <div className="relative z-10 w-full max-w-[1300px] mx-auto py-4">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 rounded-2xl overflow-hidden shadow-2xl bg-white border border-[#e5eeff]">
          
          {/* Left Panel: Deep Emerald Green Brand & Security Card */}
          <section className="lg:col-span-5 bg-gradient-to-br from-[#003828] via-[#0d503c] to-[#00271b] text-white p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden">
            {/* Ambient decorative depth glow */}
            <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-[#6cf8bb]/15 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-[#4edea3]/10 blur-3xl pointer-events-none" />

            {/* Top Brand Section */}
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

              <div className="space-y-2 pt-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#b1f0d4] text-[11px] font-semibold backdrop-blur-sm border border-white/10">
                  <span className="material-symbols-outlined text-[15px]">verified_user</span>
                  <span>Protokol Keamanan Terpusat</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                  Keamanan &amp; Integritas Akun Anda Adalah Prioritas Kami
                </h1>
                <p className="text-xs sm:text-sm text-[#dce9ff]/90 leading-relaxed">
                  Platform aksi keberlanjutan dan pelaporan ESG StyleUp dilindungi dengan arsitektur enkripsi tingkat institusional untuk menjamin akuntabilitas data aksi lingkungan Anda.
                </p>
              </div>
            </div>

            {/* Middle: Verified Certifications & Badges */}
            <div className="relative z-10 my-6 space-y-2.5">
              <div className="p-3.5 rounded-xl bg-black/20 backdrop-blur-sm flex items-start gap-3 border border-white/10">
                <span className="material-symbols-outlined text-[#6cf8bb] text-xl mt-0.5">enhanced_encryption</span>
                <div>
                  <p className="text-xs text-white font-bold">Enkripsi Multi-Faktor SHA-256</p>
                  <p className="text-[11px] text-[#b1f0d4]/80 mt-0.5">Autentikasi token sekali pakai dengan masa kedaluwarsa kriptografis real-time.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-black/20 backdrop-blur-sm flex items-start gap-3 border border-white/10">
                <span className="material-symbols-outlined text-[#6cf8bb] text-xl mt-0.5">policy</span>
                <div>
                  <p className="text-xs text-white font-bold">Terverifikasi Standar ISO 27001 &amp; Bappenas</p>
                  <p className="text-[11px] text-[#b1f0d4]/80 mt-0.5">Sesuai tata kelola kepatuhan privasi data dampak iklim dan portofolio SDG.</p>
                </div>
              </div>
            </div>

            {/* Bottom Guidance Tips */}
            <div className="relative z-10 pt-3 border-t border-white/15 space-y-1.5">
              <p className="text-[11px] uppercase tracking-wider text-[#6cf8bb] font-bold">Tips Perlindungan Kredensial:</p>
              <ul className="text-xs text-[#dce9ff]/80 space-y-1 list-disc list-inside">
                <li>Gunakan kombinasi minimal 8 karakter dengan simbol khusus.</li>
                <li>Jangan pernah memberikan kode OTP atau Magic Link kepada siapapun.</li>
                <li>Pastikan domain pengirim berakhiran resmi <span className="text-white font-semibold">@styleup.id</span>.</li>
              </ul>
            </div>
          </section>

          {/* Right Panel: Password Recovery Form */}
          <section className="lg:col-span-7 bg-white p-8 lg:p-12 flex flex-col justify-between">
            {/* Top Back Navigation */}
            <div className="w-full flex items-center justify-between pb-6 border-b border-[#eff4ff]">
              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="inline-flex items-center gap-1.5 text-xs text-[#006c49] hover:text-[#003828] font-bold px-3 py-1.5 -ml-3 rounded-lg hover:bg-[#eff4ff] transition-all cursor-pointer group"
              >
                <span className="material-symbols-outlined text-[18px] transition-transform group-hover:-translate-x-1">arrow_back</span>
                <span>Kembali ke Halaman Masuk</span>
              </button>
              <span className="text-[11px] text-[#707974] bg-[#eff4ff] px-2.5 py-1 rounded-full font-semibold">
                Bantuan ID: SEC-8092
              </span>
            </div>

            {/* Main Recovery Content */}
            <div className="max-w-md w-full mx-auto space-y-5 my-auto py-6">
              {/* Header Content */}
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-xl bg-[#dce9ff] flex items-center justify-center text-[#003828] shadow-sm mb-2">
                  <span className="material-symbols-outlined text-[28px]">lock_reset</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#0b1c30]">
                  Pemulihan Kata Sandi
                </h2>
                <p className="text-xs sm:text-sm text-[#707974] leading-relaxed">
                  Masukkan alamat email atau nomor WhatsApp yang terdaftar pada akun StyleUp Anda. Kami akan mengirimkan tautan verifikasi sekali pakai (Magic Link / OTP) untuk mengatur ulang sandi secara aman.
                </p>
              </div>

              {/* Channel Switcher Tab */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#0b1c30]">Pilih Metode Penerimaan</label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-[#eff4ff] rounded-xl border border-[#e5eeff]">
                  <button
                    type="button"
                    onClick={() => { setChannel('email'); setSubmitted(false); }}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      channel === 'email'
                        ? 'bg-[#0d503c] text-white shadow-sm'
                        : 'text-[#404944] hover:text-[#0b1c30]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">mail</span>
                    <span>Kirim via Email</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setChannel('wa'); setSubmitted(false); }}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      channel === 'wa'
                        ? 'bg-[#0d503c] text-white shadow-sm'
                        : 'text-[#404944] hover:text-[#0b1c30]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">chat</span>
                    <span>Kirim via WhatsApp</span>
                  </button>
                </div>
              </div>

              {/* Form Element */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#0b1c30]">
                    {channel === 'email' ? 'Alamat Email Terdaftar' : 'Nomor WhatsApp Terdaftar'}
                  </label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3.5 text-[#707974] text-[18px] pointer-events-none">
                      {channel === 'email' ? 'mail' : 'phone'}
                    </span>
                    <input
                      type={channel === 'email' ? 'email' : 'tel'}
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder={channel === 'email' ? 'nama@email.com' : '0812-xxxx-xxxx'}
                      required
                      className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#eff4ff] text-[#0b1c30] placeholder:text-[#707974] text-xs sm:text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#006c49]/40 border border-transparent transition-all"
                    />
                  </div>
                  <p className="text-[11px] text-[#707974]">
                    {channel === 'email'
                      ? 'Pastikan domain email Anda aktif untuk menerima link konfirmasi otomatis.'
                      : 'Pastikan nomor WhatsApp aktif untuk menerima kode verifikasi OTP 6-digit.'}
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full h-11 rounded-xl bg-[#0d503c] hover:bg-[#003828] text-white text-xs sm:text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <span>Kirim Instruksi Pemulihan</span>
                  <span className="material-symbols-outlined text-[18px]">send</span>
                </button>
              </form>

              {/* Success Notification */}
              {submitted && (
                <div className="p-4 rounded-2xl bg-[#6cf8bb]/20 border border-[#006c49]/30 text-[#003828] space-y-2 animate-fade-in">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#006c49] text-xl">check_circle</span>
                      <span className="text-xs font-bold text-[#0b1c30]">Instruksi Pemulihan Berhasil Dikirim!</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="text-[#707974] hover:text-[#0b1c30] cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base">close</span>
                    </button>
                  </div>
                  <p className="text-xs text-[#404944] leading-relaxed">
                    Instruksi telah dikirimkan ke <strong className="text-[#003828]">{identifier}</strong>. Silakan periksa pesan Anda.
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-[#006c49]/20 text-xs">
                    <span className="text-[#707974] flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">schedule</span>
                      Kirim ulang kode dalam:
                    </span>
                    {timerActive ? (
                      <span className="font-bold text-[#006c49]">{countdown} detik</span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResend}
                        className="font-bold text-[#006c49] hover:underline cursor-pointer"
                      >
                        Kirim Ulang Sekarang
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Security Policy Info Box */}
              <div className="p-3.5 rounded-xl bg-[#eff4ff]/60 border border-[#e5eeff] flex items-start gap-3">
                <span className="material-symbols-outlined text-[#006c49] text-xl mt-0.5">shield</span>
                <div className="space-y-0.5">
                  <p className="text-xs text-[#0b1c30] font-bold">Batas Waktu Validasi Tautan</p>
                  <p className="text-[11px] text-[#707974] leading-relaxed">
                    Untuk keamanan portofolio SDG Anda, tautan verifikasi hanya berlaku selama <strong className="text-[#0b1c30]">15 menit</strong> sejak dikirimkan.
                  </p>
                </div>
              </div>

              {/* Help & Support */}
              <div className="p-3 rounded-xl bg-[#eff4ff]/40 border border-[#e5eeff] flex items-center justify-between text-xs text-[#707974]">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#707974] text-base">help_center</span>
                  <span>Kendala pemulihan?</span>
                </div>
                <div className="flex items-center gap-2 font-semibold text-[#006c49]">
                  <a href="#help" onClick={(e) => { e.preventDefault(); alert('Pusat Bantuan 24/7 Bappenas-StyleUp: support@styleup.id'); }} className="hover:underline">Help Center</a>
                  <span>•</span>
                  <a href="#wa" onClick={(e) => { e.preventDefault(); alert('Hubungi WhatsApp Hotline Siaga: +62 812-3456-7890'); }} className="hover:underline">WhatsApp Relawan</a>
                </div>
              </div>
            </div>

            {/* Bottom Footer Links */}
            <div className="pt-4 border-t border-[#eff4ff] text-center">
              <p className="text-xs text-[#707974]">
                Sudah ingat kata sandi Anda?{' '}
                <button
                  type="button"
                  onClick={() => onNavigate('login')}
                  className="font-bold text-[#006c49] hover:text-[#003828] hover:underline cursor-pointer"
                >
                  Masuk ke Akun
                </button>
              </p>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}
