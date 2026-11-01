import React from 'react';

export default function StatusKurasiModal({ isOpen, onClose, proposal }) {
  if (!isOpen || !proposal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#0b1c30]/75 backdrop-blur-sm animate-fade-in">
      {/* Modal Container: Fixed max height with flex structure */}
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-[460px] w-full shadow-2xl border border-[#e5eeff] flex flex-col max-h-[85vh] animate-slide-up overflow-hidden">
        
        {/* 1. FIXED HEADER */}
        <div className="flex items-center justify-between p-4 border-b border-[#e5eeff] bg-white shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              proposal.status === 'approved' 
                ? 'bg-[#6cf8bb]/40 text-[#006c49]'
                : proposal.status === 'rejected'
                ? 'bg-[#ffdad6] text-[#ba1a1a]'
                : 'bg-[#fef08a] text-[#854d0e]'
            }`}>
              <span className="material-symbols-outlined text-[20px]">
                {proposal.status === 'approved' ? 'verified' : proposal.status === 'rejected' ? 'cancel' : 'hourglass_top'}
              </span>
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#707974] block truncate">
                Audit Lapangan &amp; Kurasi Bappenas RI
              </span>
              <h3 className="text-sm sm:text-base font-bold text-[#0b1c30] leading-tight truncate">
                Status Pengajuan Proyek
              </h3>
            </div>
          </div>
        </div>

        {/* 2. SMOOTH SCROLLABLE CONTENT BODY (Dengan scrollbar jelas & mulus) */}
        <div 
          className="flex-1 overflow-y-auto p-4 space-y-3 scroll-smooth"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#006c49 #f1f5f9',
          }}
        >
          {/* Status Tracker Badge */}
          <div className={`p-3 rounded-xl border flex flex-col gap-1.5 ${
            proposal.status === 'approved'
              ? 'bg-[#edf9f3] border-[#6cf8bb]/60 text-[#00513b]'
              : proposal.status === 'rejected'
              ? 'bg-[#fff5f5] border-[#ffdad6] text-[#ba1a1a]'
              : 'bg-[#fefce8] border-[#fef08a] text-[#854d0e]'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider">Status Terkini:</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold shadow-2xs bg-white">
                <span className={`w-2 h-2 rounded-full ${
                  proposal.status === 'approved' ? 'bg-[#006c49]' : proposal.status === 'rejected' ? 'bg-[#ba1a1a]' : 'bg-[#eab308] animate-ping'
                }`} />
                {proposal.status === 'approved' ? 'Disetujui & Aktif Publik' : proposal.status === 'rejected' ? 'Ditolak / Perlu Revisi' : 'Menunggu Persetujuan Admin'}
              </span>
            </div>
            <p className="text-[11px] leading-relaxed opacity-90">
              {proposal.status === 'approved'
                ? 'Selamat! Proposal inisiatif SDGs Anda telah disetujui oleh tim kurator. Proyek kini telah tayang secara resmi di katalog eksplorasi publik.'
                : proposal.status === 'rejected'
                ? 'Proposal belum memenuhi standar kelayakan data geospasial ISO 14064. Silakan revisi dokumen pendukung Anda.'
                : 'Proposal Anda saat ini berada dalam antrean peninjauan oleh tim Auditor Bappenas RI. Persetujuan dilakukan langsung oleh pihak administrator berwenang (14 hari kerja).'}
            </p>
          </div>

          {/* Project Details */}
          <div className="bg-[#f8f9ff] rounded-xl p-3 border border-[#e5eeff] space-y-1.5 text-[11px]">
            <div className="flex justify-between border-b border-[#eff4ff] pb-1.5">
              <span className="text-[#707974]">Nama Inisiatif:</span>
              <span className="font-bold text-[#0b1c30] text-right max-w-[240px] truncate">{proposal.title}</span>
            </div>
            <div className="flex justify-between border-b border-[#eff4ff] pb-1.5">
              <span className="text-[#707974]">Lokasi Wilayah:</span>
              <span className="font-semibold text-[#0b1c30]">{proposal.location}</span>
            </div>
            <div className="flex justify-between border-b border-[#eff4ff] pb-1.5">
              <span className="text-[#707974]">Target Pendanaan:</span>
              <span className="font-bold text-[#006c49]">Rp {proposal.target?.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between border-b border-[#eff4ff] pb-1.5">
              <span className="text-[#707974]">Kebutuhan Relawan:</span>
              <span className="font-semibold text-[#0b1c30]">{proposal.volunteers}</span>
            </div>
            <div className="flex justify-between pt-0.5">
              <span className="text-[#707974]">Waktu Pengajuan:</span>
              <span className="font-medium text-[#707974]">
                {new Date(proposal.submittedAt || Date.now()).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })} WIB
              </span>
            </div>
          </div>

          {/* Matriks Penilaian Pencocokan & Verifikasi Berbasis Aturan StyleUp */}
          <div className="bg-white rounded-xl p-3 border border-[#e5eeff] shadow-xs space-y-2 text-[11px]">
            <div className="flex items-center justify-between border-b border-[#eff4ff] pb-1.5">
              <div>
                <span className="font-bold text-[#0b1c30] text-[11px] block">Matriks Penilaian Verifikasi Proyek</span>
                <span className="text-[9.5px] text-[#707974]">Algoritma Pencocokan Multi-Kriteria StyleUp &amp; Bappenas RI</span>
              </div>
              <div className="text-right">
                <span className="text-[9.5px] text-[#707974] block">Total Skor:</span>
                <span className="text-xs font-black text-[#006c49]">
                  {((90 * 0.25) + (85 * 0.20) + (85 * 0.20) + (80 * 0.15) + (90 * 0.10) + (85 * 0.10)).toFixed(1)} / 100
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              {[
                { label: 'Relevansi Target SDGs', weight: '25%', score: 90, desc: 'Kesesuaian indikator 17 SDGs' },
                { label: 'Kesesuaian Lokasi & Isu', weight: '20%', score: 85, desc: 'Prioritas daerah 3T / kritis' },
                { label: 'Kewajaran Anggaran', weight: '20%', score: 85, desc: 'RAB & efisiensi biaya impact' },
                { label: 'Kesiapan Sumber Daya', weight: '15%', score: 80, desc: 'Alat, material & mitra lokal' },
                { label: 'Keahlian Pelaksana', weight: '10%', score: 90, desc: 'Kompetensi relawan/tim PIC' },
                { label: 'Minat & Tujuan CSR', weight: '10%', score: 85, desc: 'Sinergi prioritas konsorsium' },
              ].map((item, idx) => (
                <div key={idx} className="p-2 rounded-lg bg-[#f8f9ff] border border-[#e5eeff]/80 flex flex-col justify-between">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="font-bold text-[#0b1c30] text-[10px] truncate">{item.label}</span>
                    <span className="px-1 py-0.2 rounded bg-[#e5eeff] text-[#003828] text-[9px] font-black shrink-0">
                      {item.weight}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[9.5px]">
                    <span className="text-[#707974] truncate text-[9px]">{item.desc}</span>
                    <span className="font-bold text-[#006c49] shrink-0">{item.score}/100</span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-[#e5eeff] h-1 rounded-full mt-1 overflow-hidden">
                    <div className="bg-[#006c49] h-full rounded-full" style={{ width: `${item.score}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Catatan Peninjauan Tim StyleUp */}
            <div className="p-2 rounded-lg bg-[#6cf8bb]/15 border border-[#6cf8bb]/40 text-[10px] text-[#00513b] leading-relaxed">
              <span className="font-bold block mb-0.5 flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">policy</span>
                Catatan Peninjauan Tim Kurator:
              </span>
              Hasil skor tetap ditinjau dan diverifikasi secara independen oleh tim auditor Bappenas RI sebelum direkomendasikan kepada mitra dan dipublikasikan resmi.
            </div>
          </div>
        </div>

        {/* 3. FIXED FOOTER (Tombol Selesai Saja) */}
        <div className="p-3 sm:p-4 border-t border-[#e5eeff] bg-white shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-[#eff4ff] hover:bg-[#e0e9f8] text-[#003828] text-xs font-bold transition-all flex items-center justify-center cursor-pointer border border-[#dce9ff] shadow-xs active:scale-98"
          >
            <span>Selesai</span>
          </button>
        </div>

      </div>
    </div>
  );
}
