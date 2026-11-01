import { useState, useEffect } from 'react';
import { printInvoice } from '../utils/printInvoice';
import { getDonations } from '../utils/api';

const TRANSAKSI_DATA = [
  {
    id: 'TRX-SDG-2026-0891',
    date: '23 Okt 2026, 14:32 WIB',
    projectTitle: 'Restorasi 150 Ha Sabuk Hijau Mangrove Pesisir Delta Mahakam',
    location: 'Kutai Kartanegara, Kalimantan Timur',
    sdgs: [{ num: 13, label: 'Aksi Iklim', color: '#3F7E44' }, { num: 14, label: 'Ekosistem Laut', color: '#0A97D9' }],
    amount: 500000,
    platformFee: 0,
    total: 500000,
    paymentMethod: 'QRIS - Bank Mandiri',
    status: 'Berhasil',
    taxEligible: true,
    taxCertNumber: 'PMK-04/BAPPENAS/2026/0891',
    impactVal: 'Setara 25 Bibit Mangrove & 180 kg CO2e Serapan Karbon',
  },
  {
    id: 'TRX-SDG-2026-0512',
    date: '18 Sep 2026, 09:15 WIB',
    projectTitle: 'Peningkatan Literasi Digital Pemuda Pesisir Banyuwangi',
    location: 'Banyuwangi, Jawa Timur',
    sdgs: [{ num: 4, label: 'Pendidikan Bermutu', color: '#C5192D' }, { num: 8, label: 'Ekonomi Layak', color: '#A21942' }],
    amount: 500000,
    platformFee: 0,
    total: 500000,
    paymentMethod: 'BCA Virtual Account',
    status: 'Berhasil',
    taxEligible: true,
    taxCertNumber: 'PMK-04/BAPPENAS/2026/0512',
    impactVal: 'Dukungan Fasilitas 2 Unit Tablet Belajar Komunal',
  },
  {
    id: 'TRX-SDG-2026-0104',
    date: '04 Agu 2026, 16:40 WIB',
    projectTitle: 'Konservasi Terumbu Karang Biorock & Zona Perlindungan Laut Wakatobi',
    location: 'Wakatobi, Sulawesi Tenggara',
    sdgs: [{ num: 14, label: 'Ekosistem Laut', color: '#0A97D9' }],
    amount: 500000,
    platformFee: 0,
    total: 500000,
    paymentMethod: 'GoPay / QRIS Nasional',
    status: 'Berhasil',
    taxEligible: true,
    taxCertNumber: 'PMK-04/BAPPENAS/2026/0104',
    impactVal: 'Restorasi 1 Struktur Biorock & Monitoring Satelit GNSS',
  },
];

export default function RiwayatPembayaranPage({ onNavigate, currentUser, onAddNotification }) {
  if (!currentUser) {
    return (
      <div className="w-full min-h-[82vh] bg-[#f8f9ff] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-lg border border-[#e5eeff] max-w-lg w-full text-center flex flex-col items-center animate-slide-up">
          <div className="w-16 h-16 rounded-2xl bg-[#eff4ff] text-[#006c49] flex items-center justify-center mb-4 ring-8 ring-[#eff4ff]/60">
            <span className="material-symbols-outlined text-3xl">receipt_long</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0b1c30] mb-2">
            Riwayat Pembayaran Terkunci
          </h2>
          <p className="text-xs sm:text-sm text-[#404944] leading-relaxed mb-6">
            Anda sedang dalam <strong>Mode Tamu Tanpa Akun</strong>. Silakan masuk ke akun Anda untuk melihat arsip riwayat donasi terverifikasi dan mengunduh bukti potong pajak PMK-04 sah.
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

  const [transactions, setTransactions] = useState(TRANSAKSI_DATA);
  const [filterStatus, setFilterStatus] = useState('semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTx, setSelectedTx] = useState(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Ambil transaksi riil dari MySQL XAMPP
  useEffect(() => {
    async function fetchTransactions() {
      try {
        const res = await getDonations(currentUser?.email);
        if (res.success && res.donations && res.donations.length > 0) {
          setTransactions(res.donations);
        }
      } catch (e) {
        console.warn('Gagal memuat riwayat donasi dari MySQL, menggunakan data lokal:', e);
      }
    }
    if (currentUser) {
      fetchTransactions();
    }
  }, [currentUser]);

  const activeDonorName = currentUser ? currentUser.name : 'Najlaa Khairunnisa Arwanto';

  function formatRp(n) {
    return `Rp ${n.toLocaleString('id-ID')}`;
  }

  function handlePrint(tx, label) {
    printInvoice(tx, activeDonorName);
    setDownloadSuccess(label || `Invoice & Bukti Potong Pajak ${tx.id || ''}`);
    setTimeout(() => setDownloadSuccess(false), 3500);
    if (onAddNotification) {
      onAddNotification({
        type: 'info',
        icon: 'receipt_long',
        title: 'Dokumen Pajak & Kwitansi Diunduh 📄',
        message: `Kwitansi bukti pembayaran donasi PMK-04 (${tx.id}) berhasil dicetak/diunduh.`,
        link: 'riwayat-pembayaran',
        linkText: 'Buka Riwayat →',
      });
    }
  }

  const filteredTransactions = transactions.filter((tx) => {
    const matchStatus = filterStatus === 'semua' || tx.status.toLowerCase() === filterStatus.toLowerCase();
    const matchQuery =
      (tx.projectTitle || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tx.id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tx.paymentMethod || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tx.location || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchQuery;
  });

  const totalDonasi = transactions.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

  function triggerDownload(label) {
    setDownloadSuccess(label);
    setTimeout(() => setDownloadSuccess(false), 3000);
  }

  return (
    <div className="w-full bg-[#f8f9ff] py-6 sm:py-8 min-h-screen">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-6 sm:gap-8">
        
        {/* Breadcrumb Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-[#404944] flex-wrap">
            <button onClick={() => onNavigate('beranda')} className="hover:text-[#003828] cursor-pointer transition-colors">
              Beranda
            </button>
            <span className="material-symbols-outlined text-sm text-[#707974]">chevron_right</span>
            <button onClick={() => onNavigate('profil')} className="hover:text-[#003828] cursor-pointer transition-colors">
              Profil Saya
            </button>
            <span className="material-symbols-outlined text-sm text-[#707974]">chevron_right</span>
            <span className="font-bold text-[#006c49]">Riwayat Pembayaran &amp; Insentif Pajak</span>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <button
              onClick={() => handlePrint(TRANSAKSI_DATA[0], 'Rekap Pajak Tahunan PMK-04')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-[#eff4ff] text-[#003828] text-xs font-bold transition-all border border-[#e5eeff] shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[17px] text-[#006c49]">file_download</span>
              <span>Unduh Rekap Pajak (PDF)</span>
            </button>
            <button
              onClick={() => onNavigate('pembayaran')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0d503c] hover:bg-[#003828] text-white text-xs font-bold transition-all shadow-sm hover:scale-105 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[17px] text-[#6cf8bb]">volunteer_activism</span>
              <span>+ Donasi Baru</span>
            </button>
          </div>
        </div>

        {/* Download Alert Toast */}
        {downloadSuccess && (
          <div className="p-3.5 rounded-xl bg-[#6cf8bb]/30 border border-[#006c49]/30 text-xs text-[#003828] font-bold flex items-center justify-between animate-fade-in shadow-xs">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-[#006c49]">check_circle</span>
              <span>Dokumen <strong>{downloadSuccess}</strong> berhasil diunduh ke perangkat Anda.</span>
            </div>
            <button onClick={() => setDownloadSuccess(false)} className="text-[#006c49] hover:underline text-[11px]">
              Tutup
            </button>
          </div>
        )}

        {/* Page Header Banner */}
        <div className="bg-gradient-to-br from-[#0d503c] via-[#003828] to-[#00271b] rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white shadow-md border border-white/10 relative overflow-hidden">
          <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full bg-[#6cf8bb]/15 blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-md text-[#b1f0d4] text-[11px] font-semibold border border-white/10">
                <span className="material-symbols-outlined text-sm">receipt_long</span>
                Buku Besar Transaksi &amp; Bukti Potong Pajak Sah
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Riwayat Pembayaran Donasi
              </h1>
              <p className="text-xs sm:text-sm text-[#dce9ff]/90 leading-relaxed">
                Seluruh kontribusi Anda dikelola secara transparan melalui *Escrow Account* resmi Bappenas RI tanpa potongan biaya platform, dan memenuhi syarat pengurangan penghasilan bruto sesuai regulasi <strong>PMK 04</strong>.
              </p>
            </div>

            {/* Total Balance Card */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 sm:p-5 rounded-2xl shrink-0 flex flex-col justify-center min-w-[220px]">
              <span className="text-[11px] text-[#b1f0d4] font-medium">Total Akumulasi Donasi Saya</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#6cf8bb] my-1">
                {formatRp(totalDonasi)}
              </div>
              <span className="text-[10px] text-white/80 flex items-center gap-1">
                <span className="material-symbols-outlined text-xs text-[#6cf8bb]">verified</span>
                3 Transaksi Terverifikasi 100%
              </span>
            </div>
          </div>
        </div>

        {/* 4 Summary Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-2xl bg-white shadow-sm border border-[#e5eeff] flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#707974] mb-1">
              <span className="text-xs font-semibold">Total Donasi</span>
              <div className="w-8 h-8 rounded-lg bg-[#eff4ff] text-[#006c49] flex items-center justify-center">
                <span className="material-symbols-outlined text-lg">payments</span>
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-[#0b1c30]">{formatRp(totalDonasi)}</div>
            <span className="text-[11px] text-[#006c49] font-medium mt-1">3 Sektor SDGs Didanai</span>
          </div>

          <div className="p-4 rounded-2xl bg-white shadow-sm border border-[#e5eeff] flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#707974] mb-1">
              <span className="text-xs font-semibold">Biaya Platform</span>
              <div className="w-8 h-8 rounded-lg bg-[#eff4ff] text-[#006c49] flex items-center justify-center">
                <span className="material-symbols-outlined text-lg">savings</span>
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-[#006c49]">Rp 0 (0%)</div>
            <span className="text-[11px] text-[#707974] mt-1">100% Ditanggung Pemerintah</span>
          </div>

          <div className="p-4 rounded-2xl bg-white shadow-sm border border-[#e5eeff] flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#707974] mb-1">
              <span className="text-xs font-semibold">Pengurang Pajak Sah</span>
              <div className="w-8 h-8 rounded-lg bg-[#eff4ff] text-[#006c49] flex items-center justify-center">
                <span className="material-symbols-outlined text-lg">gavel</span>
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-[#0b1c30]">{formatRp(totalDonasi)}</div>
            <span className="text-[11px] text-[#006c49] font-medium mt-1">Sesuai Regulasi PMK 04</span>
          </div>

          <div className="p-4 rounded-2xl bg-white shadow-sm border border-[#e5eeff] flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#707974] mb-1">
              <span className="text-xs font-semibold">Status Audit ESG</span>
              <div className="w-8 h-8 rounded-lg bg-[#eff4ff] text-[#006c49] flex items-center justify-center">
                <span className="material-symbols-outlined text-lg">fact_check</span>
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-[#003828]">ISO 14064</div>
            <span className="text-[11px] text-[#006c49] font-medium mt-1">Terverifikasi Bappenas</span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-[#e5eeff] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#707974] text-lg">
              search
            </span>
            <input
              type="text"
              placeholder="Cari transaksi berdasarkan nama proyek, ID transaksi, atau metode bayar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-[#bfc9c2] focus:border-[#006c49] focus:outline-none bg-[#f8f9ff]"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#707974] font-medium hidden sm:inline">Status:</span>
            {['semua', 'berhasil'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all capitalize cursor-pointer ${
                  filterStatus === st
                    ? 'bg-[#0d503c] text-white shadow-xs'
                    : 'bg-[#f0f4f9] text-[#404944] hover:bg-[#e5eeff]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Transaction Cards List */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between text-xs text-[#707974] px-1">
            <span className="font-bold text-[#0b1c30]">Daftar Dokumen Transaksi ({filteredTransactions.length})</span>
            <span>Menampilkan data sah tercatat secara real-time</span>
          </div>

          {filteredTransactions.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-[#e5eeff] flex flex-col items-center gap-3">
              <span className="material-symbols-outlined text-5xl text-[#707974]">receipt</span>
              <h3 className="text-sm font-bold text-[#0b1c30]">Tidak Ada Riwayat Pembayaran yang Cocok</h3>
              <p className="text-xs text-[#707974] max-w-sm">
                Coba ubah kata kunci pencarian atau lakukan donasi baru untuk inisiatif keberlanjutan.
              </p>
              <button
                onClick={() => { setSearchQuery(''); setFilterStatus('semua'); }}
                className="mt-2 px-4 py-2 rounded-xl bg-[#006c49] text-white text-xs font-bold"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            filteredTransactions.map((tx) => (
              <div
                key={tx.id}
                className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-[#e5eeff] hover:border-[#6cf8bb]/60 transition-all flex flex-col gap-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#e5eeff]">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-mono text-xs font-bold text-[#006c49] bg-[#6cf8bb]/25 px-2.5 py-1 rounded-lg">
                      {tx.id}
                    </span>
                    <span className="text-xs text-[#707974] flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">schedule</span>
                      {tx.date}
                    </span>
                    <span className="text-xs text-[#707974]">•</span>
                    <span className="text-xs text-[#404944] font-medium flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs text-[#006c49]">credit_card</span>
                      {tx.paymentMethod}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#6cf8bb]/40 text-[#00513b] text-xs font-bold">
                      <span className="material-symbols-outlined text-sm">check_circle</span>
                      {tx.status}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-[#eff4ff] text-[#003828] text-[11px] font-semibold border border-[#dce9ff]">
                      PMK-04 Valid
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                  {/* Project Info */}
                  <div className="lg:col-span-8 flex flex-col gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {(tx.sdgs || [
                        { num: 13, label: 'Aksi Iklim', color: '#3F7E44' },
                        { num: 14, label: 'Ekosistem Laut', color: '#0A97D9' }
                      ]).map((s) => (
                        <span
                          key={s.num}
                          className="px-2 py-0.5 rounded text-[10px] font-bold text-white shadow-2xs"
                          style={{ backgroundColor: s.color }}
                        >
                          SDG {s.num}: {s.label}
                        </span>
                      ))}
                      <span className="text-xs text-[#707974] flex items-center gap-0.5 ml-1">
                        <span className="material-symbols-outlined text-xs">location_on</span>
                        {tx.location || 'Indonesia'}
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-[#0b1c30] leading-snug">
                      {tx.projectTitle}
                    </h3>

                    <p className="text-xs text-[#404944] flex items-center gap-1.5 bg-[#f8f9ff] p-2.5 rounded-xl border border-[#e5eeff]">
                      <span className="material-symbols-outlined text-[#006c49] text-base shrink-0">eco</span>
                      <span>Dampak Nyata: <strong>{tx.impactVal}</strong></span>
                    </p>
                  </div>

                  {/* Financial & Action Buttons */}
                  <div className="lg:col-span-4 flex flex-col lg:items-end justify-between gap-3 pt-2 lg:pt-0 border-t lg:border-t-0 border-[#e5eeff]">
                    <div className="text-left lg:text-right">
                      <span className="text-[11px] text-[#707974] block">Nominal Donasi Disalurkan:</span>
                      <span className="text-xl font-extrabold text-[#003828]">{formatRp(tx.amount)}</span>
                      <span className="text-[10px] text-[#006c49] block font-semibold">Biaya Platform: Rp 0 (Gratis)</span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => setSelectedTx(tx)}
                        className="px-3.5 py-1.5 rounded-xl bg-[#eff4ff] hover:bg-[#e0e9f8] text-[#003828] text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[16px]">visibility</span>
                        <span>Lihat Invoice</span>
                      </button>
                      <button
                        onClick={() => handlePrint(tx, `Bukti Potong Pajak & Invoice ${tx.id}`)}
                        className="px-3.5 py-1.5 rounded-xl bg-[#0d503c] hover:bg-[#003828] text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-xs"
                      >
                        <span className="material-symbols-outlined text-[16px] text-[#6cf8bb]">file_download</span>
                        <span>Unduh PDF</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Regulasi Pajak PMK-04 Info Banner */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white shadow-sm border border-[#e5eeff] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#006c49] text-white flex items-center justify-center shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-2xl">account_balance</span>
            </div>
            <div className="space-y-1">
              <h4 className="text-xs sm:text-sm font-bold text-[#0b1c30]">
                Fasilitas Pengurangan Penghasilan Bruto (Peraturan Menteri Keuangan No. 04)
              </h4>
              <p className="text-xs text-[#707974] leading-relaxed max-w-3xl">
                Berdasarkan ketentuan perpajakan nasional Republik Indonesia, setiap donasi program kebencanaan dan pelestarian lingkungan yang disalurkan melalui platform terdaftar Bappenas RI dapat dilaporkan pada SPT Tahunan sebagai pengurang pajak penghasilan sah.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('sertifikasi')}
            className="px-4 py-2 rounded-xl bg-[#eff4ff] hover:bg-[#e0e9f8] text-[#006c49] text-xs font-bold whitespace-nowrap cursor-pointer shrink-0"
          >
            Pusat Sertifikasi &amp; ISO →
          </button>
        </div>

      </div>

      {/* Invoice Detail Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#e5eeff] flex flex-col gap-4 my-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#e5eeff]">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-[#0d503c] text-[#6cf8bb] flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-lg">receipt</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#0b1c30]">Tanda Terima Donasi Sah</h3>
                  <span className="text-[10px] text-[#707974] font-mono">{selectedTx.id}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedTx(null)}
                className="w-7 h-7 rounded-full bg-[#eff4ff] hover:bg-[#e0e9f8] flex items-center justify-center text-[#404944] cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            {/* Receipt Body */}
            <div className="p-4 rounded-xl bg-[#f8f9ff] border border-[#e5eeff] space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-[#707974]">Waktu Transaksi</span>
                <span className="font-semibold text-[#0b1c30]">{selectedTx.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#707974]">Metode Pembayaran</span>
                <span className="font-semibold text-[#0b1c30]">{selectedTx.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#707974]">Status Transaksi</span>
                <span className="font-bold text-[#006c49] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#006c49]" />
                  Berhasil Disalurkan (0% Fee)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#707974]">No. Registrasi Pajak PMK</span>
                <span className="font-mono text-[#003828] font-bold">{selectedTx.taxCertNumber}</span>
              </div>

              <div className="pt-2 border-t border-[#e5eeff]">
                <span className="text-[#707974] block mb-1">Inisiatif Sasaran:</span>
                <strong className="text-[#0b1c30] block leading-snug">{selectedTx.projectTitle}</strong>
                <span className="text-[11px] text-[#707974]">{selectedTx.location}</span>
              </div>

              <div className="pt-2 border-t border-[#e5eeff] space-y-1.5">
                <div className="flex justify-between text-[#707974]">
                  <span>Donasi Netto</span>
                  <span>{formatRp(selectedTx.amount)}</span>
                </div>
                <div className="flex justify-between text-[#707974]">
                  <span>Biaya Layanan Platform</span>
                  <span className="text-[#006c49] font-bold">Rp 0 (Ditanggung Bappenas)</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-[#003828] pt-1 border-t border-[#e5eeff]">
                  <span>Total Donasi</span>
                  <span>{formatRp(selectedTx.total)}</span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => {
                  handlePrint(selectedTx, `Kwitansi Resmi ${selectedTx.id}`);
                  setSelectedTx(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#0d503c] hover:bg-[#003828] text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">download</span>
                <span>Unduh Bukti Transaksi (Print/PDF)</span>
              </button>
              <button
                onClick={() => setSelectedTx(null)}
                className="px-4 py-2.5 rounded-xl bg-[#eff4ff] hover:bg-[#e0e9f8] text-[#0b1c30] text-xs font-semibold cursor-pointer"
              >
                Tutup
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
