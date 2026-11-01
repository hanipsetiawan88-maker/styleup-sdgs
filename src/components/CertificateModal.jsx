import { useState } from 'react';
import { LOGO_URL } from '../data';
import { printCertificate } from '../utils/printInvoice';

export default function CertificateModal({
  isOpen,
  onClose,
  donorName = 'Najlaa Khairunnisa Arwanto',
  nominal = 1500000,
  projectTitle = 'Restorasi Terumbu Karang Biorock Wakatobi & Mitigasi Peatland Karhutla Kalimantan',
  co2 = '450',
  bibit = 12,
}) {
  const [certType, setCertType] = useState('donatur'); // 'donatur' | 'relawan'
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  function formatRp(n) {
    return new Intl.NumberFormat('id-ID').format(n || 0);
  }

  function handleCopyLink() {
    navigator.clipboard?.writeText(`https://styleup.id/verify-cert/ISO14064-${Date.now().toString(16).toUpperCase()}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#0b1c30]/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-[#e5eeff] overflow-hidden my-auto animate-slide-up flex flex-col max-h-[92vh]">
        
        {/* Modal Top Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 bg-[#eff4ff] border-b border-[#e5eeff] shrink-0">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006c49] text-2xl">workspace_premium</span>
            <div>
              <h3 className="text-sm font-bold text-[#0b1c30]">Piagam Akreditasi &amp; Sertifikat Resmi</h3>
              <p className="text-[11px] text-[#707974]">Terakreditasi Bappenas RI &amp; Audit Karbon ISO 14064-1</p>
            </div>
          </div>

          {/* Tab Selector: Donatur vs Relawan */}
          <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-[#e5eeff]">
            <button
              onClick={() => setCertType('donatur')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                certType === 'donatur'
                  ? 'bg-[#0d503c] text-white shadow-sm'
                  : 'text-[#404944] hover:text-[#0b1c30]'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">payments</span>
              <span>Sertifikat Penyumbang</span>
            </button>
            <button
              onClick={() => setCertType('relawan')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                certType === 'relawan'
                  ? 'bg-[#0d503c] text-white shadow-sm'
                  : 'text-[#404944] hover:text-[#0b1c30]'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">volunteer_activism</span>
              <span>Sertifikat Relawan</span>
            </button>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-[#e5eeff] text-[#404944] hover:text-[#0b1c30] flex items-center justify-center transition-colors cursor-pointer shrink-0 ml-auto sm:ml-0"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Scrollable Certificate Body */}
        <div className="p-4 sm:p-8 overflow-y-auto flex-1 bg-[#f8f9ff]">
          
          {/* Certificate Sheet (Printable A4 Canvas) */}
          <div className="relative w-full bg-white rounded-2xl shadow-lg border-4 border-[#0d503c]/20 p-6 sm:p-10 relative overflow-hidden">
            
            {/* Guilloche & Watermark */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.035] flex items-center justify-center overflow-hidden">
              <svg className="text-[#003828] fill-none stroke-current" height="600" strokeWidth="0.4" viewBox="0 0 100 100" width="600">
                <circle cx="50" cy="50" r="45" strokeDasharray="1 1" />
                <circle cx="50" cy="50" r="38" />
                <circle cx="50" cy="50" r="30" strokeDasharray="2 1" />
                <circle cx="50" cy="50" r="22" />
                <path d="M50 0 L50 100 M0 50 L100 50 M15 15 L85 85 M15 85 L85 15" />
                <polygon points="50,12 61,38 88,38 66,54 75,80 50,64 25,80 34,54 12,38 39,38" />
              </svg>
            </div>

            {/* Inner Border Accent */}
            <div className="border border-[#006c49]/30 rounded-xl p-5 sm:p-8 relative z-10 flex flex-col gap-4">
              
              {/* Top Institutional Header */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-[#0d503c]/15">
                <div className="flex items-center gap-3">
                  <div className="bg-[#eff4ff] p-2 rounded-xl">
                    <img src={LOGO_URL} alt="Logo" className="h-8 w-auto object-contain" />
                  </div>
                  <div>
                    <span className="block text-base font-bold text-[#003828] leading-tight">StyleUp SDGs Indonesia</span>
                    <span className="block text-[10px] text-[#006c49] font-semibold uppercase tracking-wider">
                      Pusat Akreditasi &amp; Validasi Lingkungan Hidup
                    </span>
                  </div>
                </div>

                <div className="text-center sm:text-right">
                  <div className="flex items-center sm:justify-end gap-1.5 text-xs font-bold text-[#003828]">
                    <span className="material-symbols-outlined text-[#006c49] text-base">flag_circle</span>
                    <span>Sekretariat Nasional SDGs Bappenas RI</span>
                  </div>
                  <div className="text-[10px] text-[#707974] font-mono mt-0.5">
                    REG. GRI-BAP-2026-3335/ESG-ID • ISO 14064-1 AUDITED
                  </div>
                </div>
              </div>

              {/* Document Title */}
              <div className="text-center pt-2">
                <span className="inline-block px-3 py-0.5 rounded-full bg-[#6cf8bb]/30 text-[#006c49] text-[10px] font-bold uppercase tracking-wider mb-2 border border-[#6cf8bb]/40">
                  Dokumen Negara Terverifikasi • Berbasis Kriptografis
                </span>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#003828] tracking-tight">
                  PIAGAM AKREDITASI NASIONAL
                </h2>
                <div className="text-xs sm:text-sm font-bold text-[#006c49] mt-0.5">
                  {certType === 'donatur'
                    ? 'SERTIFIKAT KONTRIBUSI DAMPAK ESG & FILANTROPIS HIJAU'
                    : 'SERTIFIKAT RELAWAN TANGGAP IKLIM & AKSI LAPANGAN TAPAK'}
                </div>
                <p className="text-xs text-[#707974] italic mt-2">
                  Diberikan dengan kehormatan dan apresiasi setinggi-tingginya kepada:
                </p>
              </div>

              {/* Recipient Name Hero Box */}
              <div className="text-center py-3 bg-[#eff4ff]/60 rounded-2xl px-4 border border-[#e5eeff]">
                <div className="text-2xl sm:text-3xl font-bold text-[#003828] tracking-tight">
                  {donorName || 'Najlaa Khairunnisa Arwanto'}
                </div>
                <div className="flex items-center justify-center gap-2 flex-wrap text-xs text-[#707974] mt-1.5">
                  <span className="font-mono bg-white px-2 py-0.5 rounded font-semibold text-[#006c49] border border-[#e5eeff]">
                    ID Kontributor: SUS-2026-98214
                  </span>
                  <span>•</span>
                  <span className="font-semibold text-[#0b1c30]">
                    {certType === 'donatur' ? 'Filantropis Berkelanjutan Aktif' : 'Relawan Tanggap Iklim Bersertifikat'}
                  </span>
                  <span>•</span>
                  <span className="text-[#006c49] font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">verified</span> Terverifikasi KYC Bappenas
                  </span>
                </div>
              </div>

              {/* Mission Statement Body */}
              <div className="text-center px-2 sm:px-6 py-2">
                {certType === 'donatur' ? (
                  <p className="text-xs sm:text-sm text-[#0b1c30] leading-relaxed">
                    Atas komitmen nyata dedikasi dan penyaluran kontribusi pendanaan berkelanjutan sebesar{' '}
                    <strong className="text-[#003828] font-bold">Rp {formatRp(nominal)}</strong> untuk implementasi inisiatif:
                    <span className="block font-bold text-[#006c49] mt-1 text-sm sm:text-base">
                      “{projectTitle}”
                    </span>
                  </p>
                ) : (
                  <p className="text-xs sm:text-sm text-[#0b1c30] leading-relaxed">
                    Atas komitmen dan pengabdian nyata selama{' '}
                    <strong className="text-[#003828] font-bold">40 Jam Aksi Lapangan</strong> terverifikasi GNSS BNPB, serta penanaman{' '}
                    <strong className="text-[#003828] font-bold">{bibit} Bibit Mangrove / Terumbu Karang</strong> untuk inisiatif:
                    <span className="block font-bold text-[#006c49] mt-1 text-sm sm:text-base">
                      “{projectTitle}”
                    </span>
                  </p>
                )}
              </div>

              {/* 3 SDG Verified Impact Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-1">
                <div className="bg-[#eff4ff]/70 rounded-xl p-3 flex items-center gap-3 border border-[#e5eeff]">
                  <div className="w-10 h-10 rounded-xl bg-[#0A97D9] text-white flex items-center justify-center font-bold text-base shrink-0">
                    14
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] text-[#707974] uppercase font-bold truncate">SDG 14: Ekosistem Laut</div>
                    <div className="text-sm font-bold text-[#003828] leading-tight">{bibit} Fragmen / Bibit</div>
                    <div className="text-[10px] text-[#707974]">Struktur Restorasi Lapangan</div>
                  </div>
                </div>

                <div className="bg-[#eff4ff]/70 rounded-xl p-3 flex items-center gap-3 border border-[#e5eeff]">
                  <div className="w-10 h-10 rounded-xl bg-[#3F7E44] text-white flex items-center justify-center font-bold text-base shrink-0">
                    13
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] text-[#707974] uppercase font-bold truncate">SDG 13: Aksi Iklim</div>
                    <div className="text-sm font-bold text-[#003828] leading-tight">{co2} kg CO2eq</div>
                    <div className="text-[10px] text-[#707974]">Emisi Karbon Tereduksi</div>
                  </div>
                </div>

                <div className="bg-[#eff4ff]/70 rounded-xl p-3 flex items-center gap-3 border border-[#e5eeff]">
                  <div className="w-10 h-10 rounded-xl bg-[#56C02B] text-white flex items-center justify-center font-bold text-base shrink-0">
                    15
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] text-[#707974] uppercase font-bold truncate">SDG 15: Daratan &amp; Gambut</div>
                    <div className="text-sm font-bold text-[#003828] leading-tight">20 Hektar</div>
                    <div className="text-[10px] text-[#707974]">Zona Konservasi Terpantau</div>
                  </div>
                </div>
              </div>

              {/* Signatories & Emeterai Seal */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end pt-4 pb-2 text-center">
                
                {/* Signatory 1: Bappenas RI */}
                <div className="flex flex-col items-center">
                  <div className="h-14 flex items-center justify-center relative w-full">
                    <svg className="w-36 h-10 text-[#003828] opacity-80" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" viewBox="0 0 160 48">
                      <path d="M12 36 C35 15, 45 42, 60 18 C70 5, 85 45, 100 24 C110 10, 130 38, 148 16" />
                      <path d="M45 28 C65 24, 90 26, 120 20" />
                    </svg>
                    <div className="absolute right-2 bottom-0 opacity-20 pointer-events-none">
                      <span className="material-symbols-outlined text-4xl text-[#006c49]">verified</span>
                    </div>
                  </div>
                  <div className="w-40 h-0.5 bg-[#bfc9c2]/60 my-1" />
                  <div className="text-xs font-bold text-[#003828]">Dr. R. Hendra Wicaksono, M.Sc.</div>
                  <div className="text-[10px] text-[#707974] leading-tight">
                    Koordinator Pokja Pendanaan SDGs<br />Kementerian PPN / Bappenas RI
                  </div>
                </div>

                {/* Center: Gold E-Meterai Peruri */}
                <div className="flex flex-col items-center justify-center my-2 sm:my-0">
                  <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-[#003828] via-[#006c49] to-[#0d503c] text-white flex flex-col items-center justify-center shadow-lg p-1.5 text-center">
                    <div className="w-16 h-16 rounded-full border border-white/40 flex flex-col items-center justify-center p-1 bg-white/10">
                      <span className="material-symbols-outlined text-xl text-[#6cf8bb]">workspace_premium</span>
                      <span className="text-[9px] font-bold tracking-tight uppercase leading-none text-white">VERIFIED</span>
                      <span className="text-[7px] font-extrabold text-[#6cf8bb] leading-none mt-0.5">ISO 14064-1</span>
                    </div>
                  </div>
                  <div className="text-[10px] text-[#006c49] font-bold mt-1">E-Meterai Resmi Peruri</div>
                </div>

                {/* Signatory 2: StyleUp Executive */}
                <div className="flex flex-col items-center">
                  <div className="h-14 flex items-center justify-center relative w-full">
                    <svg className="w-36 h-10 text-[#003828] opacity-80" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" viewBox="0 0 160 48">
                      <path d="M18 20 C30 38, 52 8, 70 32 C82 46, 105 14, 125 28 C135 34, 142 18, 150 24" />
                      <path d="M60 38 C80 32, 110 30, 138 26" />
                    </svg>
                    <div className="absolute right-2 bottom-0 opacity-20 pointer-events-none">
                      <span className="material-symbols-outlined text-4xl text-[#003828]">eco</span>
                    </div>
                  </div>
                  <div className="w-40 h-0.5 bg-[#bfc9c2]/60 my-1" />
                  <div className="text-xs font-bold text-[#003828]">Budi Santoso, M.B.A.</div>
                  <div className="text-[10px] text-[#707974] leading-tight">
                    Direktur Eksekutif<br />StyleUp Sustainability Foundation
                  </div>
                </div>

              </div>

              {/* QR Code & SHA-256 Ledger Footnote */}
              <div className="pt-3 bg-[#eff4ff]/60 rounded-xl p-3 flex flex-col sm:flex-row items-center gap-3 border border-[#e5eeff]">
                <div className="w-14 h-14 bg-white rounded-lg p-1 shadow-sm shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full text-[#003828]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14 0h4v2h-4v-2zm-4 0h2v2h-2v-2zm0 4h4v2h-4v-2zm6 0h2v2h-2v-2zm-6-2h2v2h-2v-2zm4 2h2v2h-2v-2zM6 6h0v0z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0 text-left text-xs">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-bold text-[#003828]">SHA-256 Hash Bukti:</span>
                    <span className="font-mono text-[10px] text-[#707974] truncate max-w-xs">
                      ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad
                    </span>
                  </div>
                  <p className="text-[10px] text-[#707974] mt-0.5 leading-tight">
                    Diakui sah sebagai deduksi pengurangan penghasilan bruto pajak (PPh) kontribusi lingkungan berdasarkan{' '}
                    <strong className="text-[#0b1c30]">PMK RI No. 04/PMK.03/2020</strong>.
                  </p>
                </div>
                <div className="shrink-0 hidden md:block">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#6cf8bb]/40 text-[#006c49] text-[10px] font-bold">
                    <span className="material-symbols-outlined text-xs">lock</span> Ledger Valid
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Modal Bottom Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 bg-white border-t border-[#e5eeff] shrink-0">
          <div className="flex items-center gap-2 text-xs text-[#707974]">
            <span className="material-symbols-outlined text-[#006c49] text-base">info</span>
            <span>Dokumen tersimpan permanen di Arsip Nasional SDGs Bappenas.</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleCopyLink}
              className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-[#eff4ff] hover:bg-[#e5eeff] text-[#003828] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm text-[#006c49]">verified</span>
              <span>{copied ? 'Tautan Tersalin!' : 'Salin Tautan Verifikasi'}</span>
            </button>

            <button
              onClick={() => printCertificate({ donorName, nominal, projectTitle, co2, bibit, certType })}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-[#0d503c] hover:bg-[#003828] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">print</span>
              <span>Cetak / Unduh PDF</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
