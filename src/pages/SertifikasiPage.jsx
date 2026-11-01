import { useState } from 'react';

const CERTIFICATES = [
  {
    id: 'GRI-BAP-2026-001',
    title: 'Sertifikat Kontribusi Restorasi Karang Biorock',
    location: 'Wakatobi, Sulawesi Tenggara',
    type: 'donation',
    nominal: 'Rp 250.000',
    co2: '45.0 kg CO2e',
    date: '12 Februari 2025',
    standards: 'ISO 14064-1 & Bappenas Verified',
    hash: 'SHA256-7F89C23D...91A4',
  },
  {
    id: 'REL-KTG-2025-08',
    title: 'Sertifikat Aksi Relawan Pemadaman Karhutla',
    location: 'Palangka Raya, Kalimantan Tengah',
    type: 'volunteer',
    hours: '24 Jam Lapangan',
    role: 'Logistik Masker & Satgas Air',
    date: '18 Januari 2025',
    standards: 'BNPB & BPBD Kalteng Terverifikasi',
    hash: 'SHA256-91BE44AC...33C1',
  },
  {
    id: 'GRI-BAP-2024-899',
    title: 'Sertifikat Penanaman Sabuk Hijau Mangrove',
    location: 'Kutai Kartanegara, Kalimantan Timur',
    type: 'donation',
    nominal: 'Rp 500.000',
    co2: '90.0 kg CO2e',
    date: '20 Desember 2024',
    standards: 'ISO 14064 & GRI Certified',
    hash: 'SHA256-11A028FC...B802',
  },
  {
    id: 'REL-NTT-2024-42',
    title: 'Sertifikat Relawan Pengajar Sekolah Pedesaan',
    location: 'Sikka, Nusa Tenggara Timur',
    type: 'volunteer',
    hours: '96 Jam Pengajaran',
    role: 'Fasilitator Literasi Numerasi',
    date: '10 November 2024',
    standards: 'Kemendikbudristek RI',
    hash: 'SHA256-55DF10AE...4912',
  },
  {
    id: 'GRI-BAP-2024-312',
    title: 'Sertifikat Hibah Filter Air Bersih Komunal',
    location: 'Lombok Utara, NTB',
    type: 'donation',
    nominal: 'Rp 750.000',
    co2: '135.0 kg CO2e',
    date: '05 September 2024',
    standards: 'Kemenkes RI & WHO WASH',
    hash: 'SHA256-42BA7701...991F',
  },
];

export default function SertifikasiPage({ onNavigate, currentUser }) {
  // Guard: Guest Mode should not show any certificates
  if (!currentUser) {
    return (
      <main className="flex-1 w-full bg-[#f8f9ff] py-16 px-4 flex items-center justify-center min-h-[82vh]">
        <div className="max-w-[560px] w-full bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-[#e5eeff] text-center flex flex-col items-center animate-slide-up">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffdad6] text-[#ba1a1a] text-[11px] font-black uppercase tracking-wider mb-4">
            <span className="material-symbols-outlined text-sm">warning</span>
            MODE TAMU TANPA AKUN
          </div>

          <div className="w-16 h-16 rounded-2xl bg-[#eff4ff] text-[#006c49] flex items-center justify-center mb-4 ring-8 ring-[#eff4ff]/60 shadow-sm">
            <span className="material-symbols-outlined text-3xl">workspace_premium</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-[#0b1c30] mb-2">
            Tidak Ada Sertifikat
          </h2>

          <p className="text-xs sm:text-sm text-[#404944] leading-relaxed mb-6 font-medium">
            Anda sedang menjelajahi website dalam <strong>Mode Tamu</strong>. Halaman ini tidak memunculkan sertifikat apapun karena dokumen resmi ISO 14064, PMK-04, dan brevet relawan hanya diterbitkan untuk akun terdaftar yang telah melakukan aksi nyata.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <button
              onClick={() => onNavigate('login')}
              className="flex-1 py-3 rounded-xl bg-[#0d503c] hover:bg-[#003828] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">login</span>
              <span>Masuk / Login Sekarang</span>
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
            className="mt-5 text-xs text-[#707974] hover:text-[#0b1c30] flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span>Kembali ke Beranda</span>
          </button>
        </div>
      </main>
    );
  }

  const [filter, setFilter] = useState('all');
  const [claimCode, setClaimCode] = useState('');
  const [claimSuccess, setClaimSuccess] = useState(false);
  const [claimedCert, setClaimedCert] = useState(null);

  function handleClaim() {
    if (!claimCode.trim()) {
      alert('Masukkan kode klaim sertifikat terlebih dahulu.');
      return;
    }
    setClaimedCert({
      id: claimCode.toUpperCase(),
      title: 'Sertifikat Kontribusi Baru Terverifikasi',
      location: 'Indonesia Archipelago',
      type: 'donation',
      nominal: 'Rp 100.000',
      co2: '18.0 kg CO2e',
      date: 'Hari ini',
      standards: 'ISO 14064 MRV Live',
      hash: 'SHA256-' + Math.random().toString(16).substring(2, 10).toUpperCase() + '...',
    });
    setClaimSuccess(true);
    setClaimCode('');
  }

  const filtered = filter === 'all'
    ? CERTIFICATES
    : CERTIFICATES.filter(c => c.type === filter);

  return (
    <main className="flex-1 w-full bg-[#f8f9ff]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">

        {/* Top Breadcrumb */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-[#404944]">
            <button onClick={() => onNavigate('beranda')} className="hover:text-[#003828] transition-colors">Beranda</button>
            <span className="material-symbols-outlined text-sm text-[#707974]">chevron_right</span>
            <span className="font-bold text-[#006c49]">Pusat Sertifikasi &amp; Kredensial Resmi</span>
          </div>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#6cf8bb]/40 text-[#00714d] text-xs font-semibold">
            <span className="material-symbols-outlined text-xs">verified</span> Kredensial Terakreditasi Bappenas
          </span>
        </div>

        {/* Hero Banner */}
        <div className="relative bg-gradient-to-br from-[#0d503c] via-[#003828] to-[#003825] text-white rounded-2xl p-6 sm:p-8 overflow-hidden shadow-xl border border-white/10">
          <div className="absolute -right-12 -top-12 w-96 h-96 bg-[#68fcbf]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#b1f0d4] text-xs font-semibold mb-3">
              <span className="material-symbols-outlined text-sm text-[#68fcbf]">verified</span>
              Standar ISO 14064-1 &amp; GRI Standards
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">Pusat Sertifikasi &amp; Kredensial Resmi</h1>
            <p className="text-xs sm:text-sm text-[#b1f0d4] leading-relaxed">
              Klaim, unduh bukti audit ESG tervalidasi, dan verifikasi sertifikat kerelawanan berbasis geolokasi dengan stempel digital resmi StyleUp Sustainability.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-4 border-t border-white/15">
            {[
              { val: '5 Dokumen', label: 'Total Sertifikat Aktif', sub: '100% Sah & Terbit', icon: 'card_membership' },
              { val: '120 Jam', label: 'Jam Aksi Tervalidasi', sub: 'GPS Logbook BNPB', icon: 'timelapse' },
              { val: 'Rp 1.500.000', label: 'Dana Kontribusi Dampak', sub: 'Escrow Terverifikasi', icon: 'eco' },
              { val: '100% Sah', label: 'Kepatuhan Pajak & ESG', sub: 'PMK No. 04/2020', icon: 'fact_check' },
            ].map((k, i) => (
              <div key={i} className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
                <div className="flex items-center justify-between text-[#b1f0d4] mb-1">
                  <span className="text-[11px] font-semibold">{k.label}</span>
                  <span className="material-symbols-outlined text-sm">{k.icon}</span>
                </div>
                <div className="text-base sm:text-lg font-bold text-white">{k.val}</div>
                <span className="text-[10px] text-[#68fcbf] block mt-0.5">{k.sub}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Claim Engine Section */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-[#e5eeff]">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="max-w-xl">
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-[#006c49]">qr_code_scanner</span>
                <h2 className="text-base font-bold text-[#0b1c30]">Verifikasi &amp; Klaim Kredensial Instan</h2>
              </div>
              <p className="text-xs text-[#404944] leading-relaxed">
                Masukkan ID Registrasi Escrow Donasi, Kode Logbook Relawan, atau Hash SHA-256 untuk memvalidasi tanda tangan verifikator program.
              </p>
            </div>

            <div className="flex-1 max-w-md w-full">
              <div className="flex items-center gap-2 bg-[#eff4ff] p-1.5 rounded-xl border border-[#006c49]/20">
                <span className="material-symbols-outlined text-[#006c49] text-base pl-2">fingerprint</span>
                <input
                  type="text"
                  value={claimCode}
                  onChange={e => setClaimCode(e.target.value)}
                  placeholder="Contoh: GRI-BAP-2026-3335"
                  className="w-full bg-transparent text-xs text-[#0b1c30] font-mono focus:outline-none placeholder:text-[#707974]"
                />
                <button
                  onClick={handleClaim}
                  className="px-4 py-2 rounded-lg bg-[#0d503c] hover:bg-[#003828] text-white text-xs font-bold transition-all shrink-0"
                >
                  Klaim
                </button>
              </div>
            </div>
          </div>

          {claimSuccess && claimedCert && (
            <div className="mt-4 p-4 rounded-xl bg-[#6cf8bb]/30 border border-[#6cf8bb] flex items-center justify-between animate-fade-in">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#006c49] text-2xl">verified</span>
                <div>
                  <div className="text-xs font-bold text-[#0b1c30]">Kode #{claimedCert.id} Berhasil Diklaim!</div>
                  <div className="text-[11px] text-[#404944]">{claimedCert.title} telah ditambahkan ke portofolio Anda.</div>
                </div>
              </div>
              <button onClick={() => setClaimSuccess(false)} className="text-xs font-bold text-[#006c49] hover:underline">
                Tutup
              </button>
            </div>
          )}
        </section>

        {/* Filter Tabs */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {[
              { id: 'all', label: `Semua Sertifikat (${CERTIFICATES.length})` },
              { id: 'donation', label: 'Donasi Dampak ESG' },
              { id: 'volunteer', label: 'Aksi Relawan' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  filter === tab.id ? 'bg-[#0d503c] text-white shadow-sm' : 'bg-white text-[#404944] hover:bg-[#eff4ff] border border-[#e5eeff]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => alert('Mengunduh semua sertifikat dalam format .ZIP...')}
            className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-[#e5eeff] text-[#0b1c30] text-xs font-semibold hover:bg-[#eff4ff] transition-all"
          >
            <span className="material-symbols-outlined text-sm">archive</span> Unduh Semua (.ZIP)
          </button>
        </div>

        {/* Certificate Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(cert => (
            <div key={cert.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-[#e5eeff] flex flex-col justify-between">
              {/* Card Header Frame */}
              <div className="bg-gradient-to-br from-[#003828] to-[#0d503c] text-white p-5 relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#6cf8bb] text-[#003828] uppercase tracking-wider">
                    {cert.type === 'donation' ? 'Donasi ESG' : 'Relawan'}
                  </span>
                  <span className="text-[11px] font-mono text-[#b1f0d4]">{cert.id}</span>
                </div>
                <h3 className="text-sm font-bold text-white mb-1 leading-snug">{cert.title}</h3>
                <p className="text-[11px] text-[#b1f0d4] flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">location_on</span> {cert.location}
                </p>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                <div className="space-y-2 text-xs">
                  {cert.nominal && (
                    <div className="flex justify-between">
                      <span className="text-[#707974]">Nilai Kontribusi:</span>
                      <span className="font-bold text-[#003828]">{cert.nominal}</span>
                    </div>
                  )}
                  {cert.co2 && (
                    <div className="flex justify-between">
                      <span className="text-[#707974]">Reduksi CO₂:</span>
                      <span className="font-bold text-[#006c49]">{cert.co2}</span>
                    </div>
                  )}
                  {cert.hours && (
                    <div className="flex justify-between">
                      <span className="text-[#707974]">Jam Relawan:</span>
                      <span className="font-bold text-[#003828]">{cert.hours}</span>
                    </div>
                  )}
                  {cert.role && (
                    <div className="flex justify-between">
                      <span className="text-[#707974]">Peran:</span>
                      <span className="font-semibold text-[#0b1c30]">{cert.role}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-[#707974]">Tanggal Terbit:</span>
                    <span className="text-[#0b1c30]">{cert.date}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-[#eff4ff]">
                    <span className="text-[#707974]">Standar:</span>
                    <span className="text-[11px] text-[#006c49] font-semibold">{cert.standards}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#eff4ff] flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono text-[#707974] truncate">{cert.hash}</span>
                  <button
                    onClick={() => alert(`Mengunduh dokumen PDF untuk ${cert.title}...`)}
                    className="px-3 py-1.5 rounded-lg bg-[#0d503c] hover:bg-[#003828] text-white text-xs font-semibold flex items-center gap-1 shrink-0 transition-all shadow-sm"
                  >
                    <span className="material-symbols-outlined text-xs">download</span> Unduh PDF
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
