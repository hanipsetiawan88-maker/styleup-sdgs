import { useState } from 'react';
import { PROJECTS, AVATAR_URL } from '../data';

const SDG_FILTERS = [
  { key: 'all', label: 'Semua SDGs', icon: 'apps' },
  { key: '4', label: 'SDG 4: Pendidikan', dot: '#C5192D' },
  { key: '6', label: 'SDG 6: Air Bersih', dot: '#26BDE2' },
  { key: '7', label: 'SDG 7: Energi Bersih', dot: '#FCC30B' },
  { key: '13', label: 'SDG 13: Aksi Iklim', dot: '#3F7E44' },
  { key: '14', label: 'SDG 14: Lautan', dot: '#0A97D9' },
  { key: '15', label: 'SDG 15: Daratan', dot: '#56C02B' },
];

export default function BerandaPage({
  onNavigate,
  onSelectProject,
  onDonate,
  currentUser,
}) {
  const [activeSDG, setActiveSDG] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  const filtered = activeSDG === 'all'
    ? PROJECTS
    : PROJECTS.filter(p => p.sdgs.some(s => String(s.num) === activeSDG));

  function formatRp(n) {
    if (n >= 1000000) return `Rp ${(n / 1000000).toFixed(1)} Jt`;
    return `Rp ${(n / 1000).toFixed(0)}rb`;
  }

  return (
    <div className="w-full bg-[#f8f9ff] py-3 sm:py-4">
      <div className="max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 flex flex-col gap-4 sm:gap-6">

        {/* Breadcrumb & ISO Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-[#404944] flex-wrap">
            <span className="font-semibold text-[#003828]">Beranda</span>
            <span className="material-symbols-outlined text-sm text-[#707974]">chevron_right</span>
            <span className="text-[#006c49] font-bold">Ikhtisar Aksi SDGs Nasional 2026</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#6cf8bb]/40 text-[#006c49] text-[11px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#006c49] animate-pulse" />
              Standar Pelaporan ISO 14064
            </div>
            <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#dce9ff] text-[#0b1c30] text-[11px] font-semibold">
              <span className="material-symbols-outlined text-[#006c49] text-[14px]">verified</span>
              Selaras Agenda SDGs Bappenas
            </div>
          </div>
        </div>

        {/* Hero Banner (Clear, Professional & Engaging Landing) */}
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#0d503c] via-[#003828] to-[#00271b] text-white p-5 sm:p-6 lg:p-7 shadow-lg border border-white/10">
          <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-[#6cf8bb]/15 blur-3xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-72 h-72 rounded-full bg-[#68fcbf]/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col gap-4">
            <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-4">
              <div className="max-w-3xl flex flex-col gap-1.5">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-md text-[#b1f0d4] text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider self-start border border-white/10">
                  <span className="material-symbols-outlined text-sm">energy_savings_leaf</span>
                  Platform Aksi &amp; Kolaborasi Keberlanjutan
                </div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white leading-tight">
                  StyleUp SDGs Indonesia
                </h1>
                <p className="text-sm sm:text-base text-[#b1f0d4] font-medium">
                  {currentUser ? `Selamat datang, ${currentUser.name.split(' ')[0]}.` : 'Selamat datang di Platform StyleUp SDGs.'}
                </p>
              </div>

              {/* Action Buttons: Donasi Sekarang Sebagai Tombol Utama */}
              <div className="flex items-center gap-2.5 flex-wrap shrink-0">
                <button
                  onClick={() => onDonate ? onDonate() : onNavigate('pembayaran')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#6cf8bb] hover:bg-[#4edea3] text-[#003828] text-xs font-bold shadow-md hover:scale-105 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">volunteer_activism</span>
                  Donasi Sekarang
                </button>
                <button
                  onClick={() => onNavigate('eksplorasi')}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/15 backdrop-blur-sm text-white text-xs font-semibold hover:bg-white/25 transition-all shadow-sm cursor-pointer border border-white/15"
                >
                  <span className="material-symbols-outlined text-sm">explore</span>
                  Jelajahi Proyek
                </button>
                <button
                  onClick={() => onNavigate('sertifikasi')}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 backdrop-blur-sm text-[#dce9ff] text-xs font-semibold hover:bg-white/20 transition-all shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">menu_book</span>
                  Pelajari Cara Kerja
                </button>
              </div>
            </div>

            {/* Tentang Platform (Ringkas, Jelas & Natural Sesuai Usulan Profesional) */}
            <div className="pt-2 text-xs text-[#dce9ff] leading-relaxed max-w-4xl">
              <h2 className="text-sm sm:text-base font-bold text-white mb-1.5">
                Tentang Platform
              </h2>
              <p className="text-xs sm:text-[13px] text-white/95 leading-relaxed">
                StyleUp SDGs mempertemukan donatur, relawan, dan pelaksana proyek untuk aksi lingkungan, pendidikan, dan pengentasan kemiskinan di seluruh Indonesia. Setiap proyek dipantau secara transparan dan dilaporkan secara berkala agar dampaknya dapat ditelusuri.
              </p>
            </div>
          </div>

          {/* 4 Bento KPI Metric Pods with Data Simulasi Disclaimer */}
          <div className="mt-3 sm:mt-4 pt-3 sm:pt-3.5 border-t border-white/15 flex flex-col gap-2">
            <div className="flex items-center justify-between text-[10px] text-[#b1f0d4]/80 flex-wrap gap-1">
              <span className="font-semibold uppercase tracking-wider">Indikator Capaian Kolaboratif</span>
              <span>* Data simulasi percontohan platform</span>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
              {[
                { label: 'Proyek Terdaftar', val: '1.248', sub: 'Tersebar di 38 Provinsi', icon: 'fact_check' },
                { label: 'Dana Teralokasi', val: 'Rp 14,8 M', sub: 'Penyaluran terverifikasi', icon: 'payments' },
                { label: 'Cakupan Wilayah', val: '38 Prov', sub: 'Lintas wilayah nusantara', icon: 'travel_explore' },
                { label: 'Relawan Terdaftar', val: '18.520+', sub: 'Kontributor aktif lapangan', icon: 'groups' },
              ].map(k => (
                <div key={k.label} className="p-2.5 sm:p-3 rounded-xl bg-white/10 backdrop-blur-sm flex flex-col justify-between hover:bg-white/15 transition-all border border-white/10">
                  <div className="flex items-center justify-between text-[#b1f0d4] mb-1">
                    <span className="text-[11px] font-medium">{k.label}</span>
                    <span className="material-symbols-outlined text-[16px]">{k.icon}</span>
                  </div>
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white my-0.5 leading-tight">{k.val}</div>
                  <div className="flex items-center gap-1 text-[#6cf8bb] text-[10px] sm:text-[11px] font-medium mt-0.5">
                    <span className="material-symbols-outlined text-xs">trending_up</span>
                    {k.sub}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SDG Filters */}
        <div id="sdg-catalog-section" className="flex flex-col gap-2 scroll-mt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-bold text-[#0b1c30]">Filter Fokus Sasaran SDGs</span>
              <span className="px-2 py-0.5 rounded-full bg-[#dce9ff] text-[#404944] text-[10px] font-semibold">17 Goals Terdata</span>
            </div>
            <button
              onClick={() => onNavigate('eksplorasi')}
              className="text-xs font-semibold text-[#006c49] hover:text-[#003828] flex items-center gap-1 cursor-pointer transition-colors"
            >
              Lihat Taksonomi Lengkap
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 no-scrollbar">
            {SDG_FILTERS.map(f => (
              <button
                key={f.key}
                onClick={() => setActiveSDG(f.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeSDG === f.key
                    ? 'bg-[#0d503c] text-white shadow-sm font-bold'
                    : 'bg-white text-[#404944] hover:bg-[#eff4ff] border border-[#e5eeff]'
                }`}
              >
                {f.icon ? (
                  <span className="material-symbols-outlined text-xs">{f.icon}</span>
                ) : (
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: f.dot }} />
                )}
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Map Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-white p-6 sm:p-8 shadow-sm border border-[#e5eeff]">
          <div className="flex flex-col lg:flex-row items-stretch gap-6">
            <div className="flex-1 flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-[#006c49] text-xs font-bold mb-2">
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>map</span>
                  Pemetaan Geospasial Nusantara
                </div>
                <h2 className="text-xl font-bold text-[#0b1c30] mb-2">Distribusi Inisiatif Keberlanjutan Daerah 3T &amp; Pesisir</h2>
                <p className="text-sm text-[#404944] leading-relaxed">Pelacakan satelit berbasis koordinat GNSS dan integrasi data Bappenas untuk menjamin zero duplication pembiayaan program iklim dan konservasi.</p>
              </div>
              <div className="grid grid-cols-3 gap-3 py-3 bg-[#eff4ff]/60 rounded-xl px-4">
                {[
                  { region: 'Sumatera & Jawa', count: '542 Aksi', focus: 'SDG 7 & 12' },
                  { region: 'Kalimantan & Sulawesi', count: '398 Aksi', focus: 'Reforestasi SDG 15' },
                  { region: 'Bali, Nusa, Papua', count: '308 Aksi', focus: 'Kelautan SDG 14' },
                ].map(r => (
                  <div key={r.region} className="flex flex-col">
                    <span className="text-[11px] text-[#707974]">{r.region}</span>
                    <span className="text-base font-bold text-[#003828]">{r.count}</span>
                    <span className="text-[11px] text-[#006c49]">{r.focus}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <button onClick={() => onNavigate('pemetaan')} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0d503c] text-white text-sm font-semibold hover:bg-[#003828] transition-all shadow-sm cursor-pointer">
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>explore</span>
                  Lihat Peta SDGs Interaktif
                </button>
                <button onClick={() => onNavigate('pemetaan')} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#dce9ff] text-[#0b1c30] text-sm font-semibold hover:bg-[#e5eeff] transition-colors cursor-pointer">
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>layers</span>
                  Filter Layer Indikator
                </button>
              </div>
            </div>
            <div className="w-full lg:w-[420px] h-60 lg:h-auto min-h-[220px] rounded-xl overflow-hidden relative border border-[#e5eeff]">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDK2pkh1-twlNkl7zyLqWBrvx5A2qJkZxcFqGUPpMTIVoDov8_oSz0mNlvM82RVXpbs6FKR353BvVFknpMNB96WQvUNlVwi3UO5as8KZH_JvqfIiZL6EJOit7SyNmQqqCv7z6lZozw0BPzwWYoP056raDPmlS8BahIyt8U8JPuMxUSmOdhwMFpdzNxZbF4aBBhKRRTWNk7FawWX_BBFV0HYGJxdVO08liNBxU51L-YSK62DXO_sRkTe"
                alt="Indonesia Map"
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.src = '/citarum-reboisasi.jpg'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#003828]/80 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold">Radar Lapangan Aktif</div>
                    <div className="text-xs text-[#b1f0d4]">42 klaster restorasi aktif</div>
                  </div>
                  <div className="px-2.5 py-1 rounded bg-[#006c49] text-white text-xs font-semibold flex items-center gap-1 shadow">
                    <span className="material-symbols-outlined" style={{ fontSize: 12 }}>satellite_alt</span>
                    Live Sentinel-2
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Section */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 text-[#006c49] text-xs font-semibold mb-1">
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>crisis_alert</span>
                Aksi Prioritas Nasional
              </div>
              <h2 className="text-xl font-bold text-[#0b1c30]">Proyek Terbaru &amp; Mendesak</h2>
              <p className="text-sm text-[#404944]">Inisiatif dengan batas waktu implementasi kritis dan membutuhkan partisipasi pendanaan serta relawan bersertifikat.</p>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-[#dce9ff] text-[#003828]' : 'bg-[#eff4ff] text-[#707974] hover:bg-[#dce9ff]'}`}>
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>grid_view</span>
              </button>
              <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-[#dce9ff] text-[#003828]' : 'bg-[#eff4ff] text-[#707974] hover:bg-[#dce9ff]'}`}>
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>view_list</span>
              </button>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-16 text-[#404944]">
              <span className="material-symbols-outlined text-[#bfc9c2] block mb-2" style={{ fontSize: 48 }}>search_off</span>
              <p className="font-semibold">Tidak ada proyek untuk SDG ini</p>
              <button onClick={() => setActiveSDG('all')} className="mt-3 text-sm text-[#006c49] hover:underline">Lihat semua proyek</button>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' : 'flex flex-col gap-4'}>
              {filtered.map(p => (
                <div
                  key={p.id}
                  className={`bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-[#e5eeff] hover:border-[#bfc9c2]/40 ${viewMode === 'list' ? 'flex flex-row' : 'flex flex-col'}`}
                >
                  <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-48 shrink-0 h-auto' : 'h-48 w-full'}`}>
                    <img
                      src={p.image}
                      alt={p.title}
                      onError={(e) => { e.currentTarget.src = '/delta-mahakam.jpg'; }}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                      {p.sdgs.map(s => (
                        <span key={s.num} className="px-2 py-0.5 rounded text-white text-[11px] font-bold shadow-sm" style={{ background: s.color }}>SDG {s.num}</span>
                      ))}
                    </div>
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-white/90 text-[#006c49] text-[11px] font-bold flex items-center gap-1 shadow-sm">
                      <span className="material-symbols-outlined" style={{ fontSize: 12 }}>verified</span>
                      {p.verified}
                    </div>
                    {p.daysLeft <= 7 && (
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-[11px] bg-[#003828]/70 backdrop-blur-md px-3 py-1.5 rounded-lg">
                        <div className="flex items-center gap-1">
                          <span className="material-symbols-outlined" style={{ fontSize: 12 }}>location_on</span>
                          {p.location}
                        </div>
                        <span className="font-bold text-[#6cf8bb]">Sisa {p.daysLeft} Hari</span>
                      </div>
                    )}
                  </div>
                  <div className={`p-5 flex-1 flex flex-col justify-between gap-4 ${viewMode === 'list' ? 'py-4' : ''}`}>
                    <div>
                      <h3 className="text-sm font-bold text-[#0b1c30] hover:text-[#006c49] cursor-pointer transition-colors mb-2 line-clamp-2">{p.title}</h3>
                      <p className="text-xs text-[#404944] line-clamp-2 leading-relaxed">{p.description}</p>
                    </div>
                    <div className="flex flex-col gap-3">
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-[#0b1c30]">Terkumpul: Rp {(p.collected / 1000000).toFixed(0)} Jt</span>
                          <span className="text-[#006c49] font-bold">{p.percent}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-[#e5eeff] overflow-hidden">
                          <div className="h-full bg-[#006c49] rounded-full transition-all" style={{ width: `${p.percent}%` }} />
                        </div>
                        <div className="flex justify-between text-[11px] text-[#707974]">
                          <span>Target: Rp {(p.target / 1000000).toFixed(0)} Jt</span>
                          <span>Audit Terverifikasi</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-[#eff4ff] text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[#006c49]" style={{ fontSize: 14 }}>how_to_reg</span>
                          <span>Relawan: <strong>{p.volunteers}</strong></span>
                        </div>
                        {p.urgencyLevel === 'mendesak' ? (
                          <span className="text-[#ba1a1a] font-bold flex items-center gap-1 text-[11px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a] animate-ping" /> Mendesak
                          </span>
                        ) : p.urgencyLevel === 'urgent' || p.urgent ? (
                          <span className="text-[#d97706] font-bold flex items-center gap-1 text-[11px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#d97706]" /> Urgent
                          </span>
                        ) : (
                          <span className="text-[#006c49] font-medium text-[11px]">Biasa</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onSelectProject ? onSelectProject(p) : onNavigate('detail-proyek')}
                          className="flex-1 py-2.5 rounded-lg bg-[#0d503c] text-white text-xs font-semibold hover:bg-[#003828] transition-all shadow-sm cursor-pointer"
                        >
                          Lihat Detail Proyek
                        </button>
                        <button
                          onClick={() => onDonate ? onDonate(p) : onNavigate('pembayaran')}
                          className="flex-1 py-2.5 rounded-lg bg-[#6cf8bb] text-[#003828] text-xs font-bold hover:opacity-90 transition-all shadow-sm cursor-pointer"
                        >
                          Donasi Sekarang
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center pt-2">
            <button onClick={() => onNavigate('eksplorasi')} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#eff4ff] hover:bg-[#e5eeff] text-[#003828] text-sm font-semibold transition-all border border-[#e5eeff]">
              Lihat Semua Proyek
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
