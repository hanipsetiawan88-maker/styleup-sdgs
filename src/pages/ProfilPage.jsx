import { useState } from 'react';
import { USER, ALL_SDGS } from '../data';

export default function ProfilPage({ onNavigate, currentUser }) {
  if (!currentUser) {
    return (
      <div className="w-full min-h-[82vh] bg-[#f8f9ff] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-lg border border-[#e5eeff] max-w-lg w-full text-center flex flex-col items-center animate-slide-up">
          <div className="w-16 h-16 rounded-2xl bg-[#eff4ff] text-[#006c49] flex items-center justify-center mb-4 ring-8 ring-[#eff4ff]/60">
            <span className="material-symbols-outlined text-3xl">account_circle</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0b1c30] mb-2">
            Profil Pengguna Terkunci
          </h2>
          <p className="text-xs sm:text-sm text-[#404944] leading-relaxed mb-6">
            Anda sedang dalam <strong>Mode Tamu Tanpa Akun</strong>. Silakan masuk ke akun Anda untuk melihat portofolio SDGs, riwayat jam relawan, dan sertifikasi emisi ISO 14064 Anda.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <button
              onClick={() => onNavigate('login')}
              className="flex-1 py-3 rounded-xl bg-[#0d503c] hover:bg-[#003828] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">login</span>
              <span>Masuk ke Akun</span>
            </button>
            <button
              onClick={() => onNavigate('register')}
              className="flex-1 py-3 rounded-xl bg-[#eff4ff] hover:bg-[#e0e9f8] text-[#003828] text-xs font-bold transition-all cursor-pointer"
            >
              <span>Daftar Akun Baru</span>
            </button>
          </div>
          <button
            onClick={() => onNavigate('beranda')}
            className="mt-5 text-xs text-[#707974] hover:text-[#0b1c30] flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span>Kembali ke Beranda</span>
          </button>
        </div>
      </div>
    );
  }

  const [copied, setCopied] = useState(false);
  const [emailNotif, setEmailNotif] = useState(true);
  const [twoFa, setTwoFa] = useState(true);
  const [publicPortfolio, setPublicPortfolio] = useState(true);
  const [focusedSDGs, setFocusedSDGs] = useState([4, 8, 13]);
  const [isFocusModalOpen, setIsFocusModalOpen] = useState(false);
  const [searchSDG, setSearchSDG] = useState('');

  function toggleSDG(num) {
    setFocusedSDGs(prev =>
      prev.includes(num) ? prev.filter(n => n !== num) : [...prev, num].sort((a, b) => a - b)
    );
  }

  function removeSDG(num, e) {
    e.stopPropagation();
    setFocusedSDGs(prev => prev.filter(n => n !== num));
  }

  function copyReferral() {
    navigator.clipboard?.writeText('https://styleup.id/ref/NAJLAA2025');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="w-full bg-[#f8f9ff] py-6 sm:py-8">
      <div className="max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 flex flex-col gap-6 sm:gap-8">

        {/* Top Breadcrumb */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-[#404944]">
            <button onClick={() => onNavigate('beranda')} className="hover:text-[#003828] cursor-pointer transition-colors">Beranda</button>
            <span className="material-symbols-outlined text-sm text-[#707974]">chevron_right</span>
            <span className="font-bold text-[#006c49]">Profil Kontributor &amp; Portofolio ESG</span>
          </div>
          <button
            onClick={() => onNavigate('login')}
            className="text-xs text-[#ba1a1a] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">logout</span> Keluar Akun
          </button>
        </div>

        {/* User Profile Banner Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#e5eeff] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <img src={USER.avatar} alt={USER.name} className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover ring-4 ring-[#006c49]/20 shadow-md" />
              <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-[#006c49] ring-2 ring-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="text-xl sm:text-2xl font-bold text-[#0b1c30]">{USER.name}</h1>
                <span className="px-2 py-0.5 rounded-full bg-[#6cf8bb]/60 text-[#00714d] text-xs font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">verified</span> Terverifikasi
                </span>
              </div>
              <p className="text-xs text-[#006c49] font-semibold">{USER.role} · Anggota Sejak Jan 2024</p>
              <p className="text-xs text-[#707974] mt-0.5">{USER.email} · {USER.phone}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={copyReferral}
              className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-[#eff4ff] hover:bg-[#e5eeff] text-[#003828] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">share</span>
              {copied ? 'Tersalin!' : 'Bagikan Profil'}
            </button>
            <button
              onClick={() => onNavigate('pembayaran')}
              className="flex-1 md:flex-none px-5 py-2.5 rounded-xl bg-[#0d503c] hover:bg-[#003828] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">volunteer_activism</span>
              Donasi Baru
            </button>
          </div>
        </div>

        {/* 4 Impact Bento KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Donasi Tersalurkan', val: USER.totalDonasi, sub: '3 Inisiatif Lingkungan', icon: 'payments', color: 'bg-[#6cf8bb]/30 text-[#006c49]' },
            { label: 'Jam Relawan Lapangan', val: `${USER.totalJamRelawan} Jam`, sub: 'Tervalidasi GPS BNPB', icon: 'timelapse', color: 'bg-[#b1f0d4] text-[#003828]' },
            { label: 'Proyek Yang Didukung', val: `${USER.totalProyek} Proyek`, sub: 'Lintas 4 Provinsi', icon: 'travel_explore', color: 'bg-[#dce9ff] text-[#0b1c30]' },
            { label: 'Indeks Skor ESG', val: `${USER.esgScore} Poin`, sub: 'Top 5% Kontributor Nasional', icon: 'workspace_premium', color: 'bg-[#ffdad6] text-[#ba1a1a]' },
          ].map(k => (
            <div key={k.label} className="bg-white p-5 rounded-2xl shadow-sm border border-[#e5eeff] flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-[#707974]">{k.label}</span>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${k.color}`}>
                  <span className="material-symbols-outlined text-lg">{k.icon}</span>
                </div>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-[#0b1c30]">{k.val}</div>
              <span className="text-[11px] text-[#006c49] font-medium mt-1">{k.sub}</span>
            </div>
          ))}
        </div>

        {/* Modul: Fokus Minat SDGs */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e5eeff]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-[#0b1c30]">Fokus Minat SDGs</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-[#6cf8bb]/30 text-[#006c49] text-xs font-bold">
                  {focusedSDGs.length} dari 17 Sasaran Dipilih
                </span>
              </div>
              <p className="text-xs text-[#707974] mt-0.5">Sektor kontribusi yang selaras dengan kapabilitas keahlian dan minat sukarela Najlaa.</p>
            </div>
            <button
              onClick={() => setIsFocusModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#006c49] hover:bg-[#003828] text-white text-xs font-bold transition-all shadow-sm hover:scale-105 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              + Kelola 17 Fokus SDGs
            </button>
          </div>

          {focusedSDGs.length === 0 ? (
            <div className="p-8 text-center bg-[#f8f9ff] rounded-xl border border-dashed border-[#bfc9c2] flex flex-col items-center gap-2">
              <span className="material-symbols-outlined text-4xl text-[#707974]">psychology_alt</span>
              <p className="text-xs text-[#404944] font-medium">Belum ada sasaran SDGs yang dipilih.</p>
              <button
                onClick={() => setIsFocusModalOpen(true)}
                className="mt-1 px-4 py-2 rounded-xl bg-[#006c49] text-white text-xs font-bold"
              >
                Pilih Sasaran Sekarang
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {focusedSDGs.map(num => {
                const sdg = ALL_SDGS.find(s => s.num === num) || {
                  num,
                  title: `SDG ${num}`,
                  desc: 'Pilar Tujuan Pembangunan Berkelanjutan',
                  color: '#006c49',
                };
                return (
                  <div
                    key={num}
                    className="group relative flex items-center gap-3.5 p-3.5 rounded-xl bg-[#eff4ff]/60 hover:bg-[#eff4ff] transition-all border border-[#e5eeff] hover:border-[#6cf8bb]/60"
                  >
                    <div
                      className="w-11 h-11 rounded-xl text-white flex flex-col items-center justify-center font-bold leading-none shadow-sm shrink-0"
                      style={{ backgroundColor: sdg.color }}
                    >
                      <span className="text-[9px] opacity-90">SDG</span>
                      <span className="text-base">{sdg.num}</span>
                    </div>
                    <div className="flex flex-col min-w-0 pr-6">
                      <span className="text-xs text-[#0b1c30] font-bold truncate">{sdg.title}</span>
                      <span className="text-[11px] text-[#707974] line-clamp-1">{sdg.desc}</span>
                    </div>
                    <button
                      onClick={e => removeSDG(num, e)}
                      title="Hapus dari minat saya"
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/80 hover:bg-[#ba1a1a] hover:text-white text-[#707974] flex items-center justify-center transition-all opacity-70 group-hover:opacity-100 shadow-xs cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 2-Column Section: Left 8 Cols (Projects & Impact) | Right 4 Cols (Certificates & Settings) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column (8 Cols) */}
          <div className="lg:col-span-8 flex flex-col gap-6">

            {/* Section: Proyek Saya */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e5eeff]">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[#006c49] text-2xl">folder_special</span>
                  <h2 className="text-lg font-bold text-[#0b1c30]">Proyek Saya</h2>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#6cf8bb]/40 text-[#006c49] text-xs font-bold">
                  3 Partisipasi Terdata
                </span>
              </div>

              <div className="flex flex-col gap-4">
                {/* Project 1: Pembangunan Rumah Baca */}
                <div className="p-4 rounded-xl bg-[#eff4ff]/50 hover:bg-[#eff4ff] transition-all border border-[#e5eeff]">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded bg-[#C5192D] text-white text-[11px] font-bold">SDG 4</span>
                      <h3 className="text-sm font-bold text-[#0b1c30]">Pembangunan Rumah Baca Desa Sukamaju</h3>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#6cf8bb]/40 text-[#006c49] text-[11px] font-bold self-start sm:self-auto">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#006c49] animate-pulse" />
                      Aktif (Bulan ke-3)
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#707974] mb-3">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm text-[#006c49]">assignment_ind</span>
                      Peran: <strong className="text-[#0b1c30]">Koordinator Donasi Buku &amp; Relawan Edukasi</strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm text-[#707974]">location_on</span>
                      Sukabumi, Jawa Barat
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div>
                    <div className="flex items-center justify-between text-xs text-[#707974] mb-1">
                      <span>Pencapaian Target Fisik &amp; Buku</span>
                      <span className="font-bold text-[#003828]">75%</span>
                    </div>
                    <div className="w-full h-2 bg-[#dce9ff] rounded-full overflow-hidden">
                      <div className="h-full bg-[#006c49] rounded-full" style={{ width: '75%' }} />
                    </div>
                  </div>
                </div>

                {/* Project 2: Rehabilitasi Hutan Mangrove */}
                <div className="p-4 rounded-xl bg-[#eff4ff]/50 hover:bg-[#eff4ff] transition-all border border-[#e5eeff]">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded bg-[#3F7E44] text-white text-[11px] font-bold">SDG 13</span>
                      <h3 className="text-sm font-bold text-[#0b1c30]">Rehabilitasi Hutan Mangrove Pantai Tambakrejo</h3>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#e5eeff] text-[#404944] text-[11px] font-medium self-start sm:self-auto">
                      <span className="material-symbols-outlined text-[14px] text-[#006c49]">check_circle</span>
                      Selesai (Des 2024)
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#707974] mb-2">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm text-[#006c49]">person_check</span>
                      Peran: <strong className="text-[#0b1c30]">Relawan Penanaman Lapangan</strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm text-[#707974]">location_on</span>
                      Semarang, Jawa Tengah
                    </span>
                  </div>
                  <p className="text-xs text-[#404944] bg-white p-2.5 rounded-lg border border-[#e5eeff] leading-relaxed">
                    ✓ Menanam 250 bibit Rhizophora mucronata dan verifikasi titik geolokasi pohon ke platform Bappenas.
                  </p>
                </div>

                {/* Project 3: Literasi Digital Pemuda Pesisir */}
                <div className="p-4 rounded-xl bg-[#eff4ff]/50 hover:bg-[#eff4ff] transition-all border border-[#e5eeff]">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded bg-[#A21942] text-white text-[11px] font-bold">SDG 8</span>
                      <h3 className="text-sm font-bold text-[#0b1c30]">Peningkatan Literasi Digital Pemuda Pesisir Banyuwangi</h3>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#6cf8bb]/40 text-[#006c49] text-[11px] font-bold self-start sm:self-auto">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#006c49] animate-pulse" />
                      Aktif
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#707974] mb-2">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm text-[#006c49]">payments</span>
                      Peran: <strong className="text-[#0b1c30]">Donatur Terbuka (Rp 500.000)</strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm text-[#707974]">location_on</span>
                      Banyuwangi, Jawa Timur
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#707974]">
                    <span>Alokasi: Pembelian 2 unit tablet belajar untuk balai desa pesisir.</span>
                    <button onClick={() => onNavigate('riwayat-pembayaran')} className="text-[#006c49] font-bold hover:underline flex items-center gap-0.5 cursor-pointer">
                      Bukti Transaksi →
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Laporan & Metrik Dampak Pribadi */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e5eeff]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
                <div>
                  <h2 className="text-lg font-bold text-[#0b1c30]">Laporan &amp; Metrik Dampak Pribadi</h2>
                  <p className="text-xs text-[#707974] mt-0.5">Sektor kontribusi yang selaras dengan kapabilitas keahlian dan minat sukarela Najlaa.</p>
                </div>
                <span className="inline-flex items-center gap-1 text-[#006c49] text-xs font-bold bg-[#6cf8bb]/30 px-3 py-1 rounded-full self-start sm:self-auto">
                  <span className="material-symbols-outlined text-sm">autorenew</span>
                  Sinkronisasi Otomatis
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                {/* Metric 1: Carbon Offset */}
                <div className="p-4 rounded-xl bg-[#eff4ff]/60 flex flex-col justify-between border border-[#e5eeff]">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#006c49] text-xl">co2</span>
                      <span className="text-sm font-bold text-[#0b1c30]">Karbon Tereduksi</span>
                    </div>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#6cf8bb]/40 text-[#003828] font-bold">180 kg CO2e</span>
                  </div>
                  <p className="text-xs text-[#707974] mb-3">Sektor kontribusi yang selaras dengan kapabilitas keahlian dan minat sukarela Najlaa.</p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-[#707974]">
                      <span>Target Tahunan: 250 kg</span>
                      <span className="font-bold text-[#003828]">72%</span>
                    </div>
                    <div className="w-full h-2 bg-[#dce9ff] rounded-full overflow-hidden">
                      <div className="h-full bg-[#006c49] rounded-full" style={{ width: '72%' }} />
                    </div>
                  </div>
                </div>

                {/* Metric 2: Literasi & Edukasi */}
                <div className="p-4 rounded-xl bg-[#eff4ff]/60 flex flex-col justify-between border border-[#e5eeff]">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#003828] text-xl">auto_stories</span>
                      <span className="text-sm font-bold text-[#0b1c30]">Dampak Akses Buku</span>
                    </div>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#dce9ff] text-[#0b1c30] font-bold">45 Anak</span>
                  </div>
                  <p className="text-xs text-[#707974] mb-3">Sektor kontribusi yang selaras dengan kapabilitas keahlian dan minat sukarela Najlaa.</p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-[#707974]">
                      <span>Target Akses Komunitas: 50 Anak</span>
                      <span className="font-bold text-[#003828]">90%</span>
                    </div>
                    <div className="w-full h-2 bg-[#dce9ff] rounded-full overflow-hidden">
                      <div className="h-full bg-[#003828] rounded-full" style={{ width: '90%' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Chart: Tren Jam Relawan */}
              <div className="p-4 rounded-xl bg-white border border-[#e5eeff]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs sm:text-sm font-bold text-[#0b1c30]">Tren Jam Relawan &amp; Aksi Lapangan (6 Bulan Terakhir)</span>
                  <span className="text-xs text-[#707974] font-medium">Total: 120 Jam</span>
                </div>
                <div className="h-28 w-full flex items-end justify-between gap-3 pt-3 px-2">
                  {[
                    { label: 'Sep', val: '12j', h: '35%', bar: 'bg-[#dce9ff]' },
                    { label: 'Okt', val: '18j', h: '45%', bar: 'bg-[#dce9ff]' },
                    { label: 'Nov', val: '25j', h: '65%', bar: 'bg-[#dce9ff]' },
                    { label: 'Des', val: '32j', h: '85%', bar: 'bg-[#6cf8bb]' },
                    { label: 'Jan', val: '20j', h: '52%', bar: 'bg-[#dce9ff]' },
                    { label: 'Feb', val: '13j', h: '40%', bar: 'bg-[#0d503c]' },
                  ].map(b => (
                    <div key={b.label} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                      <span className="text-[10px] text-[#707974]">{b.val}</span>
                      <div className={`w-full rounded-t-md ${b.bar} transition-all`} style={{ height: b.h }} />
                      <span className="text-[11px] font-semibold text-[#404944]">{b.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Right Column (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6">

            {/* Section: Sertifikat Relawan */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e5eeff]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#006c49] text-2xl">workspace_premium</span>
                  <h2 className="text-base font-bold text-[#0b1c30]">Sertifikat Relawan</h2>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#6cf8bb]/40 text-[#006c49] text-xs font-bold">2 Baru</span>
              </div>

              <div className="flex flex-col gap-3">
                {/* Cert 1 */}
                <div className="p-3.5 rounded-xl bg-[#eff4ff]/60 hover:bg-[#eff4ff] transition-all border border-[#e5eeff]">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#0d503c] text-white flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-lg">verified</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-[#0b1c30] leading-tight">Relawan Tanggap Iklim Bappenas</span>
                      <span className="text-[11px] text-[#707974] mt-0.5">Diterbitkan Q1 2025 • ID: BP-IKL-9042</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#e5eeff]">
                    <span className="text-[10px] text-[#006c49] font-bold uppercase tracking-wide">Valid ISO 14064</span>
                    <div className="flex items-center gap-2">
                      <button onClick={() => onNavigate('sertifikasi')} className="px-2.5 py-1 rounded-md bg-white hover:bg-[#f8f9ff] text-[#0b1c30] text-xs font-semibold flex items-center gap-1 shadow-xs border border-[#e5eeff] cursor-pointer">
                        <span className="material-symbols-outlined text-xs">download</span> PDF
                      </button>
                      <button onClick={() => onNavigate('sertifikasi')} className="px-2.5 py-1 rounded-md bg-[#0d503c] hover:bg-[#003828] text-white text-xs font-semibold flex items-center gap-1 shadow-xs cursor-pointer">
                        <span className="material-symbols-outlined text-xs">verified_user</span> Verifikasi
                      </button>
                    </div>
                  </div>
                </div>

                {/* Cert 2 */}
                <div className="p-3.5 rounded-xl bg-[#eff4ff]/60 hover:bg-[#eff4ff] transition-all border border-[#e5eeff]">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#eff4ff] text-[#003828] flex items-center justify-center shrink-0 border border-[#e5eeff]">
                      <span className="material-symbols-outlined text-lg">military_tech</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-[#0b1c30] leading-tight">Brevet Kontributor Literasi Inklusif</span>
                      <span className="text-[11px] text-[#707974] mt-0.5">Disdik Jawa Barat • ID: JB-LIT-2024</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#e5eeff]">
                    <span className="text-[10px] text-[#707974]">Terdaftar Nasional</span>
                    <button onClick={() => onNavigate('sertifikasi')} className="px-2.5 py-1 rounded-md bg-white hover:bg-[#f8f9ff] text-[#0b1c30] text-xs font-semibold flex items-center gap-1 shadow-xs border border-[#e5eeff] cursor-pointer">
                      <span className="material-symbols-outlined text-xs">download</span> PDF
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onNavigate('sertifikasi')}
                className="w-full mt-3 py-2 text-center text-[#006c49] hover:text-[#003828] text-xs font-semibold transition-colors cursor-pointer"
              >
                Lihat Semua Sertifikat (5 Arsip) →
              </button>
            </div>

            {/* Standar Kepatuhan Card */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#e5eeff]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-[#707974] uppercase tracking-wider font-bold">Standar Kepatuhan</span>
                <span className="material-symbols-outlined text-[#006c49] text-base">verified</span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-2.5 rounded-xl bg-[#eff4ff]/60 flex flex-col">
                  <span className="text-xs font-bold text-[#0b1c30]">ISO 14064 &amp; GRI</span>
                  <span className="text-[10px] text-[#707974]">Standard Compliant</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#eff4ff]/60 flex flex-col">
                  <span className="text-xs font-bold text-[#0b1c30]">Bappenas SDGs</span>
                  <span className="text-[10px] text-[#707974]">National Verified</span>
                </div>
              </div>
            </div>

            {/* Section: Pengaturan & Keamanan */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e5eeff]">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-[#006c49] text-xl">manage_accounts</span>
                <h2 className="text-base font-bold text-[#0b1c30]">Pengaturan &amp; Keamanan</h2>
              </div>

              <div className="flex flex-col gap-3">
                {/* Toggle 1: Notifikasi Email */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#eff4ff]/60 border border-[#e5eeff]">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-[#0b1c30]">Notifikasi Email Proyek</span>
                    <span className="text-[11px] text-[#707974]">Update lapangan &amp; laporan</span>
                  </div>
                  <button
                    onClick={() => setEmailNotif(!emailNotif)}
                    className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                      emailNotif ? 'bg-[#006c49] justify-end' : 'bg-[#bfc9c2] justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                  </button>
                </div>

                {/* Toggle 2: Autentikasi 2FA */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#eff4ff]/60 border border-[#e5eeff]">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-[#0b1c30]">Autentikasi 2FA</span>
                    <span className="text-[11px] text-[#707974]">Verifikasi login via authenticator</span>
                  </div>
                  <button
                    onClick={() => setTwoFa(!twoFa)}
                    className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                      twoFa ? 'bg-[#006c49] justify-end' : 'bg-[#bfc9c2] justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                  </button>
                </div>

                {/* Toggle 3: Portofolio Publik */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#eff4ff]/60 border border-[#e5eeff]">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-[#0b1c30]">Portofolio Publik</span>
                    <span className="text-[11px] text-[#707974]">Terlihat di peta SDG Bappenas</span>
                  </div>
                  <button
                    onClick={() => setPublicPortfolio(!publicPortfolio)}
                    className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                      publicPortfolio ? 'bg-[#006c49] justify-end' : 'bg-[#bfc9c2] justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                  </button>
                </div>
              </div>

              <div className="mt-4 pt-3 flex items-center justify-between border-t border-[#e5eeff] text-xs">
                <span className="text-[#707974]">Sesi Aktif: Bandung (Chrome Desktop)</span>
                <button
                  onClick={() => onNavigate('login')}
                  className="text-[#ba1a1a] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">logout</span>
                  Keluar Sesi
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Modal Kelola 17 Fokus Minat SDGs */}
      {isFocusModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-[#e5eeff] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-[#003828] to-[#0d503c] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#6cf8bb]/20 flex items-center justify-center border border-[#6cf8bb]/30">
                  <span className="material-symbols-outlined text-2xl text-[#6cf8bb]">category</span>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold">Pilih 17 Sasaran SDGs Minat Anda</h3>
                  <p className="text-xs text-[#b1f0d4]">Tentukan pilar keberlanjutan yang ingin Anda pantau dan dukung</p>
                </div>
              </div>
              <button
                onClick={() => setIsFocusModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {/* Filter & Controls Bar */}
            <div className="p-4 bg-[#f8f9ff] border-b border-[#e5eeff] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#707974] text-lg">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Cari sasaran (contoh: Iklim, Pendidikan, Air, 13)..."
                  value={searchSDG}
                  onChange={e => setSearchSDG(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#bfc9c2] focus:border-[#006c49] focus:outline-none bg-white"
                />
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-2 text-xs">
                <span className="font-bold text-[#003828] px-2.5 py-1 rounded-lg bg-[#6cf8bb]/20">
                  {focusedSDGs.length} / 17 Dipilih
                </span>
                <button
                  type="button"
                  onClick={() => setFocusedSDGs(ALL_SDGS.map(s => s.num))}
                  className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#e5eeff] text-[#006c49] font-semibold border border-[#e5eeff] cursor-pointer"
                >
                  Pilih Semua
                </button>
                <button
                  type="button"
                  onClick={() => setFocusedSDGs([])}
                  className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#ffe5e5] text-[#ba1a1a] font-semibold border border-[#e5eeff] cursor-pointer"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Modal Body: Grid of All 17 SDGs */}
            <div className="p-4 sm:p-5 overflow-y-auto max-h-[55vh] grid grid-cols-1 md:grid-cols-2 gap-3">
              {ALL_SDGS
                .filter(sdg => {
                  if (!searchSDG.trim()) return true;
                  const q = searchSDG.toLowerCase();
                  return (
                    String(sdg.num).includes(q) ||
                    sdg.title.toLowerCase().includes(q) ||
                    sdg.desc.toLowerCase().includes(q)
                  );
                })
                .map(sdg => {
                  const isSelected = focusedSDGs.includes(sdg.num);
                  return (
                    <div
                      key={sdg.num}
                      onClick={() => toggleSDG(sdg.num)}
                      className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#eff4ff] border-[#006c49] shadow-xs'
                          : 'bg-white hover:bg-[#f8f9ff] border-[#e5eeff]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className="w-10 h-10 rounded-lg text-white flex flex-col items-center justify-center font-bold leading-none shrink-0 shadow-xs"
                          style={{ backgroundColor: sdg.color }}
                        >
                          <span className="text-[8px] opacity-90">SDG</span>
                          <span className="text-sm">{sdg.num}</span>
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-bold text-[#0b1c30] truncate">{sdg.title}</span>
                          <span className="text-[11px] text-[#707974] line-clamp-1">{sdg.desc}</span>
                        </div>
                      </div>

                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                          isSelected ? 'bg-[#006c49] text-white' : 'border-2 border-[#bfc9c2] text-transparent'
                        }`}
                      >
                        <span className="material-symbols-outlined text-sm font-bold">check</span>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#f8f9ff] border-t border-[#e5eeff] flex items-center justify-between gap-3">
              <span className="text-xs text-[#707974]">
                Perubahan tersimpan otomatis di profil kontributor Anda.
              </span>
              <button
                onClick={() => setIsFocusModalOpen(false)}
                className="px-6 py-2.5 rounded-xl bg-[#006c49] hover:bg-[#003828] text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                Selesai &amp; Simpan ({focusedSDGs.length})
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
