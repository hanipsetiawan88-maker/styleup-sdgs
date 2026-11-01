import { useState } from 'react';
import { PROJECTS, DONATION_PRESETS, PAYMENT_METHODS } from '../data';
import CertificateModal from '../components/CertificateModal';
import { printInvoice } from '../utils/printInvoice';
import { submitDonation } from '../utils/api';

const CONFETTI_COLORS = ['#6cf8bb', '#0d503c', '#4edea3', '#003828', '#45dfa4', '#68fcbf'];

function spawnConfetti() {
  for (let i = 0; i < 60; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    el.style.left = Math.random() * 100 + 'vw';
    el.style.top = '-20px';
    el.style.background = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
    el.style.width = (Math.random() * 10 + 6) + 'px';
    el.style.height = (Math.random() * 10 + 6) + 'px';
    el.style.animationDuration = (Math.random() * 2 + 1.5) + 's';
    el.style.animationDelay = Math.random() * 0.5 + 's';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 4000);
  }
}

export default function PembayaranPage({ onNavigate, initialProject, currentUser, onAddNotification }) {
  // Guard: Guest Mode is strictly forbidden from making payments
  if (!currentUser) {
    return (
      <div className="w-full min-h-[82vh] bg-[#f8f9ff] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-lg border border-[#e5eeff] max-w-lg w-full text-center flex flex-col items-center animate-slide-up">
          <div className="w-16 h-16 rounded-2xl bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center mb-4 ring-8 ring-[#ffdad6]/40">
            <span className="material-symbols-outlined text-3xl">lock</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0b1c30] mb-2">
            Kanal Pembayaran Terkunci
          </h2>
          <p className="text-xs sm:text-sm text-[#404944] leading-relaxed mb-6">
            Anda sedang menjelajahi website dalam <strong>Mode Tamu Tanpa Akun</strong>. Untuk menyalurkan donasi resmi melalui Rekening Escrow Bappenas RI serta penerbitan bukti potong pajak PMK-04 sah, Anda wajib masuk ke akun terlebih dahulu.
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
            onClick={() => onNavigate('eksplorasi')}
            className="mt-5 text-xs text-[#707974] hover:text-[#0b1c30] flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span>Kembali ke Eksplorasi Proyek</span>
          </button>
        </div>
      </div>
    );
  }

  const [step, setStep] = useState(1);
  const [selectedProject, setSelectedProject] = useState(initialProject || PROJECTS[3]);
  const [nominal, setNominal] = useState(100000);
  const [activePreset, setActivePreset] = useState(100000);
  const [paymentMethod, setPaymentMethod] = useState('qris');
  const [donorType, setDonorType] = useState('registered');
  const [donorName, setDonorName] = useState(currentUser?.name || 'Najlaa Khairunnisa Arwanto');
  const [donorEmail, setDonorEmail] = useState(currentUser?.email || 'najlaa.arwanto@esg-investama.id');
  const [donorPhone, setDonorPhone] = useState(currentUser?.phone || '+62 812-9842-1109');
  const [qrisTimer, setQrisTimer] = useState(14 * 60 + 51);
  const [timerStarted, setTimerStarted] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [projectOpen, setProjectOpen] = useState(false);

  // Impact calculator
  const factor = nominal / 100000;
  const bibit = Math.max(1, Math.round(2 * factor));
  const co2 = (18.0 * factor).toFixed(1);
  const pts = Math.round(100 * factor);
  const area = (0.5 * factor).toFixed(2);

  function formatRp(n) {
    return new Intl.NumberFormat('id-ID').format(n);
  }

  function selectPreset(val) {
    setNominal(val);
    setActivePreset(val);
    setStep(2);
  }

  function handleManualNominal(val) {
    const num = parseInt(val, 10) || 0;
    setNominal(num);
    setActivePreset(null);
    if (num > 0) {
      setStep(2);
    }
  }

  function startTimer() {
    if (timerStarted) return;
    setTimerStarted(true);
    const iv = setInterval(() => {
      setQrisTimer(t => {
        if (t <= 0) { clearInterval(iv); return 0; }
        return t - 1;
      });
    }, 1000);
  }

  function formatTimer(s) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  }

  function handleDownloadQR() {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 750;
    const ctx = canvas.getContext('2d');

    // Background putih bersih
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Header gradient hijau StyleUp SDGs
    const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
    grad.addColorStop(0, '#0d503c');
    grad.addColorStop(1, '#002b1f');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, 100);

    // Header Text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('QRIS STANDAR NASIONAL (ASPI)', canvas.width / 2, 45);

    ctx.fillStyle = '#6cf8bb';
    ctx.font = 'bold 14px system-ui, sans-serif';
    ctx.fillText('NMID: ID1024389012480 • STYLEUP SUSTAINABILITY INDONESIA', canvas.width / 2, 75);

    // Info Proyek & Nominal
    ctx.fillStyle = '#0b1c30';
    ctx.font = 'bold 16px system-ui, sans-serif';
    const cleanTitle = (selectedProject?.title || 'Proyek SDGs').slice(0, 48) + '...';
    ctx.fillText(cleanTitle, canvas.width / 2, 140);

    ctx.fillStyle = '#006c49';
    ctx.font = 'bold 28px system-ui, sans-serif';
    ctx.fillText(`Rp ${formatRp(nominal)}`, canvas.width / 2, 180);

    // Frame QRIS box
    ctx.strokeStyle = '#e5eeff';
    ctx.lineWidth = 4;
    ctx.strokeRect(100, 210, 400, 400);

    // Draw QR SVG into canvas
    const svgEl = document.getElementById('qris-svg-element');
    if (svgEl) {
      const svgData = new XMLSerializer().serializeToString(svgEl);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const URL = window.URL || window.webkitURL || window;
      const blobURL = URL.createObjectURL(svgBlob);
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 120, 230, 360, 360);
        URL.revokeObjectURL(blobURL);

        // Footer Text
        ctx.fillStyle = '#404944';
        ctx.font = '13px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Mendukung Pembayaran: BCA Mobile, Mandiri, BRI, BNI, GoPay, OVO, DANA, ShopeePay', canvas.width / 2, 650);
        ctx.fillText('Dicetak resmi via Bappenas SDGs Platform • Masa berlaku 15 Menit', canvas.width / 2, 675);

        // Download trigger
        const link = document.createElement('a');
        link.download = `QRIS-Donasi-StyleUp-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      };
      img.src = blobURL;
    } else {
      // Fallback download trigger
      const link = document.createElement('a');
      link.download = `QRIS-Donasi-StyleUp-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  }

  async function handlePay() {
    spawnConfetti();
    setSuccessModal(true);

    const methodName = PAYMENT_METHODS.find(m => m.id === paymentMethod)?.label || 'QRIS';
    const impactDescription = `Setara ${bibit} Bibit & ${co2} kg CO2e Serapan Karbon`;

    // Kirim data donasi ke MySQL backend
    try {
      await submitDonation({
        userId: currentUser?.id || null,
        projectId: selectedProject?.id || 1,
        projectTitle: selectedProject?.title || 'Proyek SDGs',
        donorName: donorType === 'registered' ? donorName : 'Donatur Anonim (Hamba Allah)',
        donorEmail: donorType === 'registered' ? donorEmail : '',
        donorPhone: donorType === 'registered' ? donorPhone : '',
        amount: nominal,
        paymentMethod: methodName,
        impactVal: impactDescription,
      });
      console.log('✅ Donasi berhasil dicatat ke MySQL XAMPP');
    } catch (err) {
      console.warn('Gagal menyimpan donasi ke MySQL:', err);
    }

    if (onAddNotification) {
      onAddNotification({
        type: 'success',
        icon: 'payments',
        title: 'Donasi Berhasil Diproses! 🎉',
        message: `Donasi Rp ${formatRp(nominal)} untuk "${selectedProject.title}" berhasil disalurkan via ${methodName}. Tersimpan otomatis di database MySQL XAMPP.`,
        link: 'riwayat-pembayaran',
        linkText: 'Buka Riwayat & Bukti Pajak →',
      });
    }
  }

  const steps = [
    { n: 1, label: 'Pilih Proyek' },
    { n: 2, label: 'Nominal' },
    { n: 3, label: 'Identitas' },
    { n: 4, label: 'Pembayaran' },
  ];

  return (
    <div className="w-full min-h-screen bg-[#f8f9ff]">
      {/* Sub-header */}
      <div className="w-full bg-[#eff4ff]/80 py-2 px-4 sm:px-8 border-b border-[#bfc9c2]/20">
        <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-2 py-0.5">
          <div className="flex items-center gap-2 text-xs text-[#404944] font-semibold">
            <button onClick={() => onNavigate('eksplorasi')} className="hover:text-[#003828] transition-colors">Eksplorasi Proyek</button>
            <span className="material-symbols-outlined text-sm text-[#707974]">chevron_right</span>
            <span className="text-[#006c49] font-bold">Kanal Pembayaran &amp; Donasi Terverifikasi</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#6cf8bb]/60 text-[#00714d] text-xs font-semibold">
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>verified_user</span>
              Transparansi 100%
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#0d503c] text-white text-xs font-bold shadow-sm">
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>volunteer_activism</span>
              Donasi Aktif
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0d503c] via-[#003828] to-[#003825] text-white p-6 sm:p-8 mb-8 shadow-lg">
          <div className="absolute -right-12 -top-12 w-80 h-80 rounded-full bg-[#6cf8bb]/10 blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#b1f0d4] text-xs font-semibold mb-3">
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>eco</span>
                Kanal Donasi Hijau Terverifikasi
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Salurkan Dampak Nyata Anda</h1>
              <p className="text-[#dce9ff]/90 text-sm leading-relaxed max-w-xl">
                Setiap rupiah donasi Anda dikawal oleh rekening escrow berlisensi Bank Indonesia dan diaudit secara transparan oleh KPMG ID. Sertifikat dampak ISO 14064 otomatis diterbitkan.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 shrink-0">
              {[
                { label: 'Total Donasi Disalurkan', value: 'Rp 14,8 M', icon: 'payments' },
                { label: 'Proyek Aktif', value: '9 Proyek', icon: 'fact_check' },
              ].map(s => (
                <div key={s.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                  <span className="material-symbols-outlined text-[#4edea3] mb-1" style={{ fontSize: 22 }}>{s.icon}</span>
                  <div className="text-lg font-bold">{s.value}</div>
                  <div className="text-[10px] text-[#b1f0d4]">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Step Indicator Wizard Bar */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-8">
          {steps.map((s, i) => {
            const isCurrent = step === s.n;
            const isDone = step > s.n || (s.n === 4 && successModal);

            return (
              <div key={s.n} className="flex items-center gap-2 sm:gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setStep(s.n);
                    if (s.n === 4) startTimer();
                  }}
                  className={`flex items-center gap-2 cursor-pointer transition-all ${
                    isCurrent ? 'text-[#003828] font-bold' : isDone ? 'text-[#006c49]' : 'text-[#707974]'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-sm transition-all ${
                    isCurrent
                      ? 'bg-[#0d503c] text-white scale-110 ring-4 ring-[#6cf8bb]/50 shadow-md'
                      : isDone
                      ? 'bg-[#0d503c] text-white'
                      : 'bg-[#e5eeff] text-[#707974] hover:bg-[#dce9ff]'
                  }`}>
                    {isDone ? (
                      <span className="material-symbols-outlined text-[15px]">check</span>
                    ) : (
                      s.n
                    )}
                  </div>
                  <span className={`hidden sm:block text-xs ${isCurrent ? 'font-bold text-[#003828]' : isDone ? 'font-semibold text-[#006c49]' : 'font-normal text-[#707974]'}`}>
                    {s.label}
                  </span>
                </button>
                {i < steps.length - 1 && (
                  <div className={`w-8 sm:w-16 h-1 rounded-full ${
                    step > s.n ? 'bg-[#006c49]' : 'bg-[#e5eeff]'
                  } transition-all`} />
                )}
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Form Sections */}
          <div className="lg:col-span-8 flex flex-col gap-6">

            {/* STEP 1: Pilih Proyek */}
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-[#e5eeff]">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step === 1 ? 'bg-[#0d503c] text-white ring-4 ring-[#6cf8bb]/40 shadow-sm' : step > 1 ? 'bg-[#006c49] text-white' : 'bg-[#e5eeff] text-[#707974]'}`}>
                    {step > 1 ? <span className="material-symbols-outlined text-[15px]">check</span> : '1'}
                  </div>
                  <h2 className="text-base font-bold text-[#0b1c30]">Pilih Proyek Penerima Manfaat</h2>
                </div>
                <span className="text-xs font-semibold text-[#006c49]">{PROJECTS.length} Proyek Terbuka</span>
              </div>

              {/* Project Dropdown */}
              <div className="relative mb-4">
                <button
                  onClick={() => setProjectOpen(!projectOpen)}
                  className="w-full bg-[#eff4ff] rounded-xl p-3.5 flex items-center justify-between hover:bg-[#e5eeff] transition-all shadow-sm"
                >
                  <span className="text-sm font-semibold text-[#0b1c30] truncate">{selectedProject.title} — ({selectedProject.location})</span>
                  <span className="material-symbols-outlined text-[#404944] shrink-0" style={{ fontSize: 20 }}>{projectOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}</span>
                </button>
                {projectOpen && (
                  <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-[#e5eeff] max-h-72 overflow-y-auto animate-slide-up">
                    {PROJECTS.map(p => (
                      <button key={p.id} onClick={() => { setSelectedProject(p); setProjectOpen(false); }} className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-[#eff4ff] transition-colors border-b border-[#f0f4ff] last:border-0 ${selectedProject.id === p.id ? 'bg-[#eff4ff]' : ''}`}>
                        <img src={p.image} alt={p.title} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[#0b1c30] truncate">{p.title}</p>
                          <p className="text-[11px] text-[#404944]">{p.location} · {p.percent}% terkumpul</p>
                          <div className="flex gap-1 mt-1">
                            {p.sdgs.map(s => (
                              <span key={s.num} className="px-1.5 py-0.5 rounded text-[10px] font-bold text-white" style={{ background: s.color }}>SDG {s.num}</span>
                            ))}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Project Card Preview */}
              <div className="bg-[#eff4ff]/60 rounded-xl p-4 flex flex-col sm:flex-row gap-4 shadow-sm">
                <img src={selectedProject.image} alt={selectedProject.title} className="w-full sm:w-24 h-36 sm:h-24 rounded-xl object-cover shadow-sm shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                    {selectedProject.sdgs.map(s => (
                      <span key={s.num} className="px-2 py-0.5 rounded text-white text-[11px] font-bold" style={{ background: s.color }}>SDG {s.num} {s.label}</span>
                    ))}
                    <span className="text-[11px] text-[#404944] truncate">{selectedProject.location}</span>
                  </div>
                  <h3 className="text-sm font-bold text-[#0b1c30] mb-2">{selectedProject.title}</h3>
                  <div className="w-full h-2 rounded-full bg-[#e5eeff] mb-1">
                    <div className="h-full bg-[#006c49] rounded-full transition-all" style={{ width: `${selectedProject.percent}%` }} />
                  </div>
                  <div className="flex justify-between text-[11px] text-[#404944]">
                    <span>Rp {formatRp(selectedProject.collected)} terkumpul</span>
                    <span className="font-bold text-[#006c49]">{selectedProject.percent}%</span>
                  </div>
                </div>
              </div>


            </section>

            {/* STEP 2: Nominal */}
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-[#e5eeff]">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step === 2 ? 'bg-[#0d503c] text-white ring-4 ring-[#6cf8bb]/40 shadow-sm' : step > 2 ? 'bg-[#006c49] text-white' : 'bg-[#e5eeff] text-[#707974]'}`}>
                    {step > 2 ? <span className="material-symbols-outlined text-[15px]">check</span> : '2'}
                  </div>
                  <h2 className="text-base font-bold text-[#0b1c30]">Pilih Nominal Donasi</h2>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#006c49]">
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>verified</span>
                  Audit Terbuka 100%
                </span>
              </div>

              {/* Preset Pills */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-4">
                {DONATION_PRESETS.map(p => (
                  <button
                    key={p}
                    onClick={() => selectPreset(p)}
                    className={`py-2.5 rounded-xl text-sm font-bold text-center transition-all shadow-sm ${activePreset === p ? 'bg-[#0d503c] text-white shadow-md scale-105' : 'bg-[#eff4ff] text-[#0b1c30] hover:bg-[#e5eeff]'}`}
                  >
                    Rp {p >= 1000000 ? (p / 1000000) + 'jt' : (p / 1000) + 'k'}
                  </button>
                ))}
              </div>

              {/* Custom input */}
              <div className="relative bg-[#eff4ff] rounded-xl px-4 py-3 flex items-center mb-6 shadow-inner focus-within:ring-2 focus-within:ring-[#006c49]/40">
                <span className="text-lg font-bold text-[#404944] pr-3">Rp</span>
                <input
                  type="number"
                  value={nominal || ''}
                  onFocus={() => setStep(2)}
                  onChange={e => handleManualNominal(e.target.value)}
                  className="w-full bg-transparent text-xl font-bold text-[#0b1c30] focus:outline-none placeholder:text-[#bfc9c2]"
                  placeholder="Nominal kustom..."
                  min={1000}
                />
              </div>

              {/* Impact Calculator */}
              <div className="bg-[#eff4ff]/70 rounded-xl p-4">
                <div className="flex items-center gap-1.5 text-[#006c49] text-xs font-bold tracking-wider uppercase mb-3">
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>eco</span>
                  Simulasi Dampak Nyata Anda:
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { icon: 'spa', val: bibit + ' Paket', label: 'Bibit / paket karang', color: 'bg-[#b1f0d4]' },
                    { icon: 'co2', val: co2 + ' kg', label: 'CO₂e reduksi', color: 'bg-[#6cf8bb]' },
                    { icon: 'workspace_premium', val: '+' + pts + ' Poin', label: 'Skor ESG', color: 'bg-[#96d3b9]' },
                    { icon: 'landscape', val: area + ' Ha', label: 'Area restorasi', color: 'bg-[#45dfa4]' },
                  ].map(item => (
                    <div key={item.label} className="bg-white rounded-xl p-3 shadow-sm flex items-center gap-2">
                      <div className={`w-9 h-9 rounded-full ${item.color} flex items-center justify-center text-[#003828] shrink-0`}>
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{item.icon}</span>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[#0b1c30] leading-tight">{item.val}</div>
                        <div className="text-[11px] text-[#404944]">{item.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 2 CTA */}
              <div className="mt-5 pt-4 border-t border-[#eff4ff] flex items-center justify-start">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 rounded-xl bg-[#eff4ff] hover:bg-[#e5eeff] text-[#003828] text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">arrow_back</span>
                  <span>Kembali</span>
                </button>
              </div>
            </section>

            {/* STEP 3: Identitas */}
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-[#e5eeff]">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step === 3 ? 'bg-[#0d503c] text-white ring-4 ring-[#6cf8bb]/40 shadow-sm' : step > 3 ? 'bg-[#006c49] text-white' : 'bg-[#e5eeff] text-[#707974]'}`}>
                    {step > 3 ? <span className="material-symbols-outlined text-[15px]">check</span> : '3'}
                  </div>
                  <h2 className="text-base font-bold text-[#0b1c30]">Identitas Donatur &amp; Sertifikasi Pajak</h2>
                </div>
                <span className="text-[11px] bg-[#b1f0d4] text-[#002116] px-2.5 py-1 rounded-full font-bold">Insentif Fiskal PMK 04</span>
              </div>

              {/* Donor type selector */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                  { id: 'anonymous', label: 'Donatur Anonim (Hamba Allah)' },
                  { id: 'registered', label: 'Donatur Terdaftar (Terverifikasi)' },
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => { setDonorType(t.id); setStep(3); }}
                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold text-center transition-all ${donorType === t.id ? 'bg-[#0d503c] text-white shadow-sm' : 'bg-[#eff4ff] text-[#404944] hover:bg-[#e5eeff]'}`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {donorType === 'registered' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {[
                    { label: 'Nama Lengkap Donatur', val: donorName, set: setDonorName, type: 'text' },
                    { label: 'Email Pengiriman E-Sertifikat', val: donorEmail, set: setDonorEmail, type: 'email' },
                  ].map(f => (
                    <div key={f.label}>
                      <label className="block text-xs font-semibold text-[#404944] mb-1.5">{f.label}</label>
                      <input
                        type={f.type}
                        value={f.val}
                        onFocus={() => setStep(3)}
                        onChange={e => { f.set(e.target.value); setStep(3); }}
                        className="w-full bg-[#eff4ff] px-4 py-2.5 rounded-xl text-sm text-[#0b1c30] focus:outline-none focus:ring-2 focus:ring-[#006c49]/40 shadow-inner"
                      />
                    </div>
                  ))}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-[#404944] mb-1.5">Nomor WhatsApp (Konfirmasi &amp; Laporan Dampak)</label>
                    <input
                      type="tel"
                      value={donorPhone}
                      onFocus={() => setStep(3)}
                      onChange={e => { setDonorPhone(e.target.value); setStep(3); }}
                      className="w-full bg-[#eff4ff] px-4 py-2.5 rounded-xl text-sm text-[#0b1c30] focus:outline-none focus:ring-2 focus:ring-[#006c49]/40 shadow-inner"
                    />
                  </div>
                </div>
              )}

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input type="checkbox" defaultChecked className="mt-1 w-4 h-4 rounded accent-[#0d503c]" />
                <span className="text-xs text-[#404944] leading-relaxed">Kirimkan e-sertifikat donasi ber-hash digital ISO 14064 dan bukti potong pajak penghasilan resmi ke email saya.</span>
              </label>

              {/* Step 3 CTA */}
              <div className="mt-5 pt-4 border-t border-[#eff4ff] flex items-center justify-start">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2.5 rounded-xl bg-[#eff4ff] hover:bg-[#e5eeff] text-[#003828] text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">arrow_back</span>
                  <span>Kembali</span>
                </button>
              </div>
            </section>

            {/* STEP 4: Metode Pembayaran */}
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-[#e5eeff]">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step === 4 ? 'bg-[#0d503c] text-white ring-4 ring-[#6cf8bb]/40 shadow-sm' : successModal ? 'bg-[#006c49] text-white' : 'bg-[#e5eeff] text-[#707974]'}`}>
                    {successModal ? <span className="material-symbols-outlined text-[15px]">check</span> : '4'}
                  </div>
                  <h2 className="text-base font-bold text-[#0b1c30]">Pilih Kanal Pembayaran</h2>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#006c49]">
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>check_circle</span>
                  Biaya Admin 0%
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {PAYMENT_METHODS.map(m => (
                  <button
                    key={m.id}
                    onClick={() => { setStep(4); setPaymentMethod(m.id); if (m.id === 'qris') startTimer(); }}
                    className={`p-3.5 rounded-xl flex flex-col items-center text-center cursor-pointer transition-all hover:scale-105 active:scale-95 ${
                      paymentMethod === m.id
                        ? 'bg-[#eff4ff] ring-2 ring-[#006c49] shadow-sm'
                        : 'bg-[#eff4ff] hover:bg-[#e5eeff]'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-1.5 shadow-sm ${paymentMethod === m.id ? 'bg-[#b1f0d4] text-[#0d503c]' : 'bg-[#e5eeff] text-[#404944]'}`}>
                      <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{m.icon}</span>
                    </div>
                    <span className="text-sm font-bold text-[#0b1c30]">{m.label}</span>
                    <span className="text-[11px] text-[#404944] mt-0.5">{m.sublabel}</span>
                    {m.id === 'qris' && <span className="mt-1.5 px-2 py-0.5 rounded-full bg-[#6cf8bb] text-[#00714d] text-[10px] font-bold">Instan</span>}
                  </button>
                ))}
              </div>

              {/* QRIS panel */}
              {paymentMethod === 'qris' && (
                <div className="bg-[#eff4ff]/60 rounded-xl p-6 flex flex-col md:flex-row items-center gap-6 shadow-sm animate-fade-in">
                  {/* QR Code SVG */}
                  <div className="bg-white p-4 rounded-xl shadow-md flex flex-col items-center shrink-0">
                    <div className="relative w-44 h-44 p-2 bg-white rounded-xl flex items-center justify-center">
                      <svg id="qris-svg-element" className="w-full h-full text-[#0d503c]" fill="currentColor" viewBox="0 0 160 160">
                        <rect fill="none" height="40" rx="4" stroke="currentColor" strokeWidth="8" width="40" x="10" y="10"/>
                        <rect fill="currentColor" height="16" width="16" x="22" y="22"/>
                        <rect fill="none" height="40" rx="4" stroke="currentColor" strokeWidth="8" width="40" x="110" y="10"/>
                        <rect fill="currentColor" height="16" width="16" x="122" y="22"/>
                        <rect fill="none" height="40" rx="4" stroke="currentColor" strokeWidth="8" width="40" x="10" y="110"/>
                        <rect fill="currentColor" height="16" width="16" x="22" y="122"/>
                        <rect height="8" width="8" x="60" y="14"/><rect height="8" width="8" x="76" y="14"/>
                        <rect height="8" width="8" x="92" y="24"/><rect height="8" width="12" x="60" y="34"/>
                        <rect height="8" width="12" x="80" y="34"/><rect height="14" width="8" x="16" y="62"/>
                        <rect height="8" width="10" x="34" y="62"/><rect height="8" width="12" x="112" y="62"/>
                        <rect height="8" width="12" x="134" y="62"/><rect height="8" width="8" x="60" y="60"/>
                        <rect height="8" width="8" x="92" y="60"/><rect height="8" width="8" x="60" y="92"/>
                        <rect height="8" width="8" x="92" y="92"/><rect height="8" width="14" x="60" y="110"/>
                        <rect height="8" width="8" x="84" y="110"/><rect height="8" width="12" x="102" y="110"/>
                        <rect height="8" width="8" x="124" y="110"/><rect height="12" width="12" x="134" y="126"/>
                        <rect height="8" width="14" x="112" y="136"/><rect height="8" width="22" x="60" y="136"/>
                      </svg>
                      <div className="absolute inset-0 m-auto w-9 h-9 rounded-full bg-white shadow flex items-center justify-center">
                        <span className="material-symbols-outlined text-[#006c49]" style={{ fontSize: 20 }}>eco</span>
                      </div>
                    </div>
                    <span className="text-[11px] text-[#003828] font-bold tracking-widest mt-2 uppercase">QRIS ASPI</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-semibold text-[#0b1c30]">Masa Berlaku:</span>
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-sm tracking-wider ${qrisTimer < 60 ? 'bg-[#ffdad6] text-[#93000a]' : 'bg-[#ffdad6] text-[#93000a]'}`}>
                        {formatTimer(qrisTimer)}
                      </span>
                    </div>
                    <p className="text-sm text-[#404944] mb-3">Pindai dengan BCA Mobile, Livin by Mandiri, GoPay, OVO, ShopeePay, atau m-Banking pilihan Anda.</p>
                    <div className="bg-white/80 p-3 rounded-xl mb-4">
                      <span className="text-xs text-[#404944]">Nominal yang ditransfer:</span>
                      <div className="text-xl font-bold text-[#006c49]">Rp {formatRp(nominal)}</div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={handleDownloadQR}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0d503c] hover:bg-[#003828] text-white text-xs font-semibold transition-all shadow-sm cursor-pointer active:scale-95"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>download</span>
                        Unduh QR Code Resmi (PNG)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          alert('Status Pembayaran: Menunggu transfer masuk dari m-Banking / E-Wallet Anda.');
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#6cf8bb]/50 hover:bg-[#6cf8bb] text-[#00714d] text-xs font-bold transition-all cursor-pointer"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>refresh</span>
                        Cek Status Pembayaran
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Virtual Account Panel */}
              {paymentMethod === 'va' && (
                <div className="bg-[#eff4ff]/60 rounded-xl p-6 animate-fade-in">
                  <p className="text-sm font-semibold text-[#0b1c30] mb-4">Pilih Bank untuk Virtual Account:</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                    {[
                      { name: 'BCA',     code: '014', img: '/banks/bca.jpg'     },
                      { name: 'Mandiri', code: '008', img: '/banks/mandiri.jpg' },
                      { name: 'BRI',     code: '002', img: '/banks/bri.jpg'     },
                      { name: 'BNI',     code: '009', img: '/banks/bni.jpg'     },
                    ].map(bank => (
                      <button
                        key={bank.name}
                        type="button"
                        className="py-3 px-3 rounded-xl bg-white border-2 border-[#006c49]/30 hover:border-[#006c49] hover:bg-[#6cf8bb]/10 transition-all shadow-sm flex flex-col items-center justify-center gap-2 cursor-pointer"
                      >
                        <div className="w-24 h-10 flex items-center justify-center">
                          <img
                            src={bank.img}
                            alt={`Logo ${bank.name}`}
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                        <span className="text-xs font-bold text-[#0b1c30]">Bank {bank.name}</span>
                      </button>
                    ))}
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm">
                    <div className="text-xs text-[#404944] mb-1">Nomor Virtual Account:</div>
                    <div className="text-xl font-mono font-bold text-[#003828] tracking-widest">1460 0123 4567 890</div>
                    <div className="text-xs text-[#404944] mt-1">Total transfer: <span className="font-bold text-[#006c49]">Rp {formatRp(nominal)}</span></div>
                  </div>
                </div>
              )}

              {/* E-Wallet Panel */}
              {paymentMethod === 'ewallet' && (
                <div className="bg-[#eff4ff]/60 rounded-xl p-6 animate-fade-in">
                  <p className="text-sm font-semibold text-[#0b1c30] mb-4">Pilih E-Wallet:</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { name: 'GoPay', color: 'bg-[#00AED6]', icon: 'payments' },
                      { name: 'OVO', color: 'bg-[#4C3494]', icon: 'account_balance_wallet' },
                      { name: 'DANA', color: 'bg-[#118EEA]', icon: 'wallet' },
                      { name: 'ShopeePay', color: 'bg-[#EE4D2D]', icon: 'shopping_bag' },
                    ].map(w => (
                      <button
                        key={w.name}
                        type="button"
                        className="py-3 px-3 rounded-xl bg-white border-2 border-[#006c49]/30 text-sm font-bold text-[#003828] hover:border-[#006c49] hover:bg-[#6cf8bb]/20 transition-all shadow-sm flex flex-col items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <div className={`w-8 h-8 rounded-lg ${w.color} text-white flex items-center justify-center shadow-sm`}>
                          <span className="material-symbols-outlined text-base">{w.icon}</span>
                        </div>
                        <span className="text-xs font-bold text-[#0b1c30]">{w.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Credit Card Panel */}
              {paymentMethod === 'card' && (
                <div className="bg-[#eff4ff]/60 rounded-xl p-6 animate-fade-in">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-semibold text-[#0b1c30]">Detail Kartu Kredit / Debit:</p>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-blue-700 text-white font-bold text-[10px] tracking-wider">VISA</span>
                      <span className="px-2 py-0.5 rounded bg-amber-600 text-white font-bold text-[10px] tracking-wider">Mastercard</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#404944] mb-1">Nomor Kartu</label>
                      <input type="text" placeholder="1234 5678 9012 3456" maxLength={19} className="w-full bg-white px-4 py-2.5 rounded-xl text-sm font-mono border border-[#e5eeff] focus:outline-none focus:ring-2 focus:ring-[#006c49]/30 shadow-sm" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-[#404944] mb-1">Masa Berlaku</label>
                        <input type="text" placeholder="MM/YY" maxLength={5} className="w-full bg-white px-4 py-2.5 rounded-xl text-sm border border-[#e5eeff] focus:outline-none focus:ring-2 focus:ring-[#006c49]/30 shadow-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#404944] mb-1">CVV</label>
                        <input type="password" placeholder="***" maxLength={4} className="w-full bg-white px-4 py-2.5 rounded-xl text-sm border border-[#e5eeff] focus:outline-none focus:ring-2 focus:ring-[#006c49]/30 shadow-sm" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#404944] mb-1">Nama di Kartu</label>
                      <input type="text" placeholder="Nama sesuai kartu" className="w-full bg-white px-4 py-2.5 rounded-xl text-sm border border-[#e5eeff] focus:outline-none focus:ring-2 focus:ring-[#006c49]/30 shadow-sm" />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4 CTA */}
              <div className="mt-6 pt-4 border-t border-[#eff4ff] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-4 py-2.5 rounded-xl bg-[#eff4ff] hover:bg-[#e5eeff] text-[#003828] text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">arrow_back</span>
                  <span>Kembali</span>
                </button>
                <button
                  type="button"
                  onClick={handlePay}
                  className="px-6 py-2.5 rounded-xl bg-[#0d503c] hover:bg-[#003828] text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <span className="material-symbols-outlined text-base">lock</span>
                  <span>Bayar Donasi Sekarang (Rp {formatRp(nominal)})</span>
                </button>
              </div>
            </section>

            {/* History Mini */}
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-[#e5eeff]">
              <h2 className="text-base font-bold text-[#0b1c30] mb-4">Riwayat Donasi Terkini</h2>
              <div className="space-y-3">
                {[
                  { proj: 'Restorasi Mangrove Delta Mahakam', amount: 'Rp 500.000', date: '15 Mar 2025', status: 'Tersalurkan' },
                  { proj: 'Biorock Wakatobi', amount: 'Rp 250.000', date: '02 Feb 2025', status: 'Tersalurkan' },
                  { proj: 'Sekolah NTT', amount: 'Rp 750.000', date: '10 Jan 2025', status: 'Tersalurkan' },
                ].map((h, i) => (
                  <div key={i} className="flex items-center justify-between py-2.5 px-4 rounded-xl bg-[#eff4ff] hover:bg-[#e5eeff] transition-colors">
                    <div>
                      <div className="text-xs font-semibold text-[#0b1c30]">{h.proj}</div>
                      <div className="text-[11px] text-[#404944]">{h.date}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-sm font-bold text-[#003828]">{h.amount}</div>
                      <div className="inline-flex items-center gap-1 text-[11px] text-[#006c49] font-semibold">
                        <span className="material-symbols-outlined" style={{ fontSize: 12 }}>check_circle</span>
                        {h.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* RIGHT: Sticky Summary */}
          <div className="lg:col-span-4 sticky top-24 flex flex-col gap-4">
            {/* Summary Card */}
            <div className="bg-white rounded-2xl p-6 shadow-md border border-[#e5eeff]">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#eff4ff]">
                <h3 className="text-base font-bold text-[#0b1c30]">Ringkasan Donasi Hijau</h3>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#6cf8bb] text-[#00714d] text-[11px] font-bold">
                  <span className="material-symbols-outlined" style={{ fontSize: 12 }}>receipt_long</span>
                  Kwitansi Instan
                </span>
              </div>

              <div className="space-y-3 text-sm pb-4 mb-4">
                {[
                  { label: 'Inisiatif', val: selectedProject.title.slice(0, 30) + '...' },
                  { label: 'Donatur', val: donorType === 'anonymous' ? 'Hamba Allah (Anonim)' : donorName },
                  { label: 'Metode', val: PAYMENT_METHODS.find(m => m.id === paymentMethod)?.label },
                ].map(row => (
                  <div key={row.label} className="flex items-start justify-between gap-2">
                    <span className="text-[#404944] shrink-0">{row.label}</span>
                    <span className={`font-semibold text-right ${row.green ? 'text-[#006c49] flex items-center gap-1' : 'text-[#0b1c30]'}`}>
                      {row.green && <span className="material-symbols-outlined" style={{ fontSize: 12 }}>check_circle</span>}
                      {row.val}
                    </span>
                  </div>
                ))}
                {/* SDG Badges */}
                <div className="flex items-center justify-between">
                  <span className="text-[#404944]">Pilar SDGs</span>
                  <div className="flex gap-1">
                    {selectedProject.sdgs.map(s => (
                      <span key={s.num} className="px-2 py-0.5 rounded text-white text-[11px] font-bold" style={{ background: s.color }}>SDG {s.num}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Total */}
              <div className="bg-[#eff4ff] rounded-xl p-4 flex items-center justify-between mb-4 ring-1 ring-[#006c49]/20">
                <div>
                  <span className="text-sm font-bold text-[#0b1c30] block">Total Penyaluran</span>
                  <span className="text-[11px] text-[#006c49] font-medium">100% dialokasikan ke mitra</span>
                </div>
                <span className="text-2xl font-extrabold text-[#0d503c] tracking-tight">Rp {formatRp(nominal)}</span>
              </div>

              {/* Trust note */}
              <div className="bg-[#6cf8bb]/30 rounded-xl p-3 flex items-start gap-2 mb-4">
                <span className="material-symbols-outlined text-[#006c49] mt-0.5 shrink-0" style={{ fontSize: 18 }}>verified</span>
                <p className="text-xs text-[#404944]">Donasi otomatis menerbitkan <strong>e-sertifikat ber-hash ISO 14064</strong> &amp; tercatat di rekap pajak tahunan.</p>
              </div>

              {/* Pay Button */}
              <button
                onClick={handlePay}
                className="w-full py-4 px-6 rounded-full bg-[#0d503c] hover:bg-[#003828] text-white text-base font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 22 }}>favorite</span>
                Bayar &amp; Salurkan Rp {formatRp(nominal)}
              </button>

              {/* Security badges */}
              <div className="flex items-center justify-center gap-4 mt-4 pt-3 border-t border-[#eff4ff] text-[11px] text-[#404944]">
                {[
                  { icon: 'lock', label: '256-Bit SSL' },
                  { icon: 'shield', label: 'Audit Bappenas' },
                  { icon: 'account_balance', label: 'Bank Indonesia' },
                ].map(b => (
                  <span key={b.label} className="flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[#006c49]" style={{ fontSize: 12 }}>{b.icon}</span>
                    {b.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Escrow Guarantee */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e5eeff]">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-full bg-[#b1f0d4] flex items-center justify-center text-[#0d503c]">
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>shield</span>
                </div>
                <span className="text-sm font-bold text-[#0b1c30]">Garansi Rekening Escrow Terkawal</span>
              </div>
              <p className="text-xs text-[#404944] leading-relaxed">Penyaluran dana bertahap menggunakan skema pencapaian milestone fisik (Proof-of-Restoration) yang dipantau sensor IoT &amp; satelit.</p>
            </div>

            {/* My Impact Card */}
            <div className="bg-gradient-to-br from-[#0d503c] to-[#003828] rounded-2xl p-5 shadow-md text-white">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-[#4edea3]" style={{ fontSize: 20 }}>eco</span>
                <span className="text-sm font-bold">Dampak Anda Sampai Saat Ini</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-center">
                {[
                  { val: 'Rp 1,5 Jt', label: 'Total Donasi' },
                  { val: '3 Proyek', label: 'Didukung' },
                  { val: '840 Poin', label: 'Skor ESG' },
                  { val: '27 kg', label: 'CO₂ Dikurangi' },
                ].map(s => (
                  <div key={s.label} className="bg-white/10 rounded-xl py-2 px-1">
                    <div className="text-base font-bold">{s.val}</div>
                    <div className="text-[10px] text-[#b1f0d4]">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {successModal && (
        <div className="fixed inset-0 z-50 bg-[#213145]/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 flex flex-col items-center text-center animate-slide-up">
            <div className="w-16 h-16 rounded-full bg-[#6cf8bb]/30 flex items-center justify-center text-[#006c49] mb-4">
              <span className="material-symbols-outlined" style={{ fontSize: 36, fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            </div>
            <h3 className="text-xl font-bold text-[#0b1c30] mb-2">Pembayaran Berhasil! 🎉</h3>
            <p className="text-sm text-[#404944] mb-1">Terima kasih, <strong>{donorName}</strong>!</p>
            <p className="text-sm text-[#404944] mb-4">
              Donasi <strong className="text-[#006c49]">Rp {formatRp(nominal)}</strong> untuk <strong>{selectedProject.title.slice(0, 40)}...</strong> telah terverifikasi melalui {PAYMENT_METHODS.find(m => m.id === paymentMethod)?.label}.
            </p>
            {/* Certificate Preview */}
            <div className="w-full bg-gradient-to-br from-[#003828] to-[#0d503c] rounded-xl p-4 text-white mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-[#4edea3]" style={{ fontSize: 20 }}>workspace_premium</span>
                <span className="text-xs font-bold tracking-wider uppercase">E-Sertifikat ISO 14064</span>
              </div>
              <div className="text-left">
                <div className="text-[11px] text-[#b1f0d4]">Penerima: {donorName}</div>
                <div className="text-[11px] text-[#b1f0d4]">Nominal: Rp {formatRp(nominal)} · CO₂ Reduksi: {co2} kg</div>
                <div className="text-[11px] text-[#4edea3] font-mono mt-1">Hash: SHA256-GRI-{Date.now().toString(16).toUpperCase()}</div>
              </div>
            </div>
            <p className="text-xs text-[#404944] mb-5">E-sertifikat ISO 14064 telah dikirim ke email <strong>{donorEmail}</strong></p>
            <div className="flex gap-2 w-full mb-2">
              <button
                type="button"
                onClick={() => {
                  printInvoice({
                    id: `INV-${Date.now().toString().slice(-6)}`,
                    date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
                    projectTitle: selectedProject.title,
                    location: selectedProject.location,
                    amount: nominal,
                    total: nominal,
                    paymentMethod: PAYMENT_METHODS.find(m => m.id === paymentMethod)?.label || 'QRIS Dinamis 24 Jam',
                    impactVal: `${bibit} Bibit Ditanam & ${co2} kg Serapan Karbon CO2e`,
                  }, donorName);
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#003828] hover:bg-[#00271b] text-[#6cf8bb] text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[17px]">receipt_long</span>
                <span>Unduh Kwitansi (PDF)</span>
              </button>
            </div>
            <div className="flex gap-2 w-full">
              <button
                type="button"
                onClick={() => {
                  setSuccessModal(false);
                  setCertModalOpen(true);
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#0d503c] hover:bg-[#003828] text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 17 }}>workspace_premium</span>
                <span>Unduh Sertifikat</span>
              </button>
              <button
                type="button"
                onClick={() => setSuccessModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#eff4ff] hover:bg-[#e5eeff] text-[#0b1c30] text-xs font-semibold transition-all cursor-pointer"
              >
                Tutup
              </button>
            </div>
            <div className="flex gap-3 mt-3 w-full">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(`Saya baru saja berdonasi Rp ${formatRp(nominal)} untuk ${selectedProject.title} di StyleUp SDGs!`);
                  alert('Tautan dampak telah disalin ke clipboard!');
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#6cf8bb]/30 hover:bg-[#6cf8bb]/50 text-[#006c49] text-xs font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>share</span>
                Bagikan Dampak
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Official Certificate Modal (Donatur & Relawan) */}
      <CertificateModal
        isOpen={certModalOpen}
        onClose={() => setCertModalOpen(false)}
        donorName={donorName}
        nominal={nominal}
        projectTitle={selectedProject.title}
        co2={co2}
        bibit={bibit}
      />
    </div>
  );
}
