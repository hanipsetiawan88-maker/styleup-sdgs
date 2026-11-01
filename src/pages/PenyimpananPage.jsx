import { useState } from 'react';
import { PROJECTS } from '../data';

export default function PenyimpananPage({
  onNavigate,
  onSelectProject,
  onDonate,
  savedProjectIds = [],
  onToggleSave,
}) {
  const [search, setSearch] = useState('');
  const [selectedSDG, setSelectedSDG] = useState('Semua');
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  // Get full project objects from saved IDs
  const savedProjects = PROJECTS.filter((p) => savedProjectIds.includes(p.id));

  // Extract unique SDGs from saved projects
  const availableSDGs = [
    'Semua',
    ...Array.from(
      new Set(savedProjects.flatMap((p) => p.sdgs.map((s) => `SDG ${s.num}`)))
    ),
  ];

  // Filtered saved projects
  const filteredProjects = savedProjects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());

    const matchesSDG =
      selectedSDG === 'Semua' ||
      p.sdgs.some((s) => `SDG ${s.num}` === selectedSDG);

    return matchesSearch && matchesSDG;
  });

  // Calculate stats
  const totalCollected = savedProjects.reduce((acc, p) => acc + p.collected, 0);
  const totalTarget = savedProjects.reduce((acc, p) => acc + p.target, 0);
  const totalVolunteers = savedProjects.reduce((acc, p) => acc + (parseInt(p.volunteers, 10) || 0), 0);
  const avgPercent = savedProjects.length
    ? Math.round(savedProjects.reduce((acc, p) => acc + p.percent, 0) / savedProjects.length)
    : 0;

  function formatRp(n) {
    return new Intl.NumberFormat('id-ID').format(n);
  }

  function handleShare(p, e) {
    e.stopPropagation();
    navigator.clipboard?.writeText(window.location.origin + `?proyek=${p.id}`);
    setCopiedId(p.id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div className="w-full min-h-screen bg-[#f8f9ff] py-6 sm:py-8">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-6">

        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-[#707974] font-medium">
          <button
            onClick={() => onNavigate('beranda')}
            className="hover:text-[#003828] transition-colors cursor-pointer"
          >
            Beranda
          </button>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span className="text-[#006c49] font-bold">Koleksi Proyek Tersimpan</span>
        </div>

        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#003828] via-[#0d503c] to-[#00271b] text-white p-6 sm:p-8 lg:p-10 shadow-lg">
          <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-[#6cf8bb]/15 blur-3xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-80 h-80 rounded-full bg-[#38bdf8]/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[#b1f0d4] text-xs font-semibold mb-3 border border-white/15">
                <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  bookmark
                </span>
                <span>Pusat Penyimpanan Inisiatif</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-2">
                Koleksi &amp; Proyek Tersimpan
              </h1>
              <p className="text-[#dce9ff]/90 text-sm sm:text-base leading-relaxed">
                Daftar inisiatif SDGs yang telah Anda simpan untuk kemudahan pemantauan berkala, penyaluran donasi gotong royong, atau pendaftaran relawan lapangan.
              </p>
            </div>

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center border border-white/10">
                <span className="material-symbols-outlined text-[#6cf8bb] text-2xl mb-1">bookmark_added</span>
                <div className="text-xl sm:text-2xl font-bold text-white">{savedProjects.length}</div>
                <div className="text-[11px] text-[#b1f0d4] font-medium">Proyek Disimpan</div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center border border-white/10">
                <span className="material-symbols-outlined text-[#6cf8bb] text-2xl mb-1">pie_chart</span>
                <div className="text-xl sm:text-2xl font-bold text-white">{avgPercent}%</div>
                <div className="text-[11px] text-[#b1f0d4] font-medium">Rerata Progres</div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center border border-white/10 col-span-2 sm:col-span-1">
                <span className="material-symbols-outlined text-[#6cf8bb] text-2xl mb-1">payments</span>
                <div className="text-lg sm:text-xl font-bold text-white">Rp {(totalCollected / 1000000).toFixed(0)} Jt</div>
                <div className="text-[11px] text-[#b1f0d4] font-medium">Total Terkumpul</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter, Search & Actions Bar */}
        {savedProjects.length > 0 && (
          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-[#e5eeff] flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#707974] text-lg">
                search
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari dalam koleksi..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#eff4ff] text-xs sm:text-sm text-[#0b1c30] placeholder:text-[#707974] focus:outline-none focus:ring-2 focus:ring-[#006c49]/40 border border-transparent focus:border-[#006c49]/30 transition-all"
              />
            </div>

            {/* SDG Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar py-1">
              {availableSDGs.map((sdg) => (
                <button
                  key={sdg}
                  onClick={() => setSelectedSDG(sdg)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedSDG === sdg
                      ? 'bg-[#0d503c] text-white shadow-xs'
                      : 'bg-[#eff4ff] text-[#404944] hover:bg-[#e0e9f8]'
                  }`}
                >
                  {sdg}
                </button>
              ))}
            </div>

            {/* Clear All Button */}
            <button
              onClick={() => setConfirmClearOpen(true)}
              className="text-xs font-bold text-[#ba1a1a] hover:text-[#93000a] hover:bg-[#ffdad6]/40 px-3 py-2 rounded-xl transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">delete_sweep</span>
              <span>Kosongkan Koleksi</span>
            </button>
          </div>
        )}

        {/* Empty State */}
        {savedProjects.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 sm:p-16 text-center shadow-sm border border-[#e5eeff] flex flex-col items-center justify-center max-w-2xl mx-auto my-6">
            <div className="w-20 h-20 rounded-full bg-[#eff4ff] flex items-center justify-center text-[#006c49] mb-4 shadow-inner">
              <span className="material-symbols-outlined text-4xl text-[#707974]">bookmark_border</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0b1c30] mb-2">
              Belum Ada Proyek yang Disimpan
            </h2>
            <p className="text-sm text-[#404944] leading-relaxed max-w-md mb-6">
              Saat menemukan proyek SDGs yang Anda sukai di beranda atau eksplorasi, klik ikon bookmark <span className="inline-flex p-1 bg-[#eff4ff] rounded text-[#006c49] align-middle"><span className="material-symbols-outlined text-xs">bookmark</span></span> untuk menyimpannya di sini.
            </p>
            <button
              onClick={() => onNavigate('eksplorasi')}
              className="px-6 py-3 rounded-xl bg-[#0d503c] hover:bg-[#003828] text-white text-xs sm:text-sm font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <span className="material-symbols-outlined text-lg">travel_explore</span>
              <span>Jelajahi Proyek SDGs Sekarang</span>
            </button>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-[#e5eeff]">
            <span className="material-symbols-outlined text-4xl text-[#707974] mb-2">search_off</span>
            <p className="text-sm font-bold text-[#0b1c30]">Tidak ada proyek tersimpan yang cocok dengan filter.</p>
            <button
              onClick={() => { setSearch(''); setSelectedSDG('Semua'); }}
              className="mt-3 text-xs font-bold text-[#006c49] hover:underline"
            >
              Reset Filter Pencarian
            </button>
          </div>
        ) : (
          /* Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-[#e5eeff] hover:border-[#6cf8bb]/60 flex flex-col justify-between group"
              >
                <div>
                  {/* Image Container with Badges */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={p.image}
                      alt={p.title}
                      onError={(e) => { e.currentTarget.src = '/delta-mahakam.jpg'; }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                    {/* Location Badge */}
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur shadow-xs text-[11px] text-[#0b1c30] font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs text-[#006c49]">location_on</span>
                      <span className="truncate max-w-[130px]">{p.location}</span>
                    </span>

                    {/* Bookmark Toggle Button (Click to Unsave) */}
                    <button
                      onClick={() => onToggleSave(p.id)}
                      title="Hapus dari Proyek Tersimpan"
                      className="absolute top-3 right-3 w-9 h-9 rounded-xl bg-white/95 text-[#003828] hover:bg-[#ba1a1a] hover:text-white shadow-md flex items-center justify-center transition-all cursor-pointer group/btn"
                    >
                      <span
                        className="material-symbols-outlined text-[19px] text-[#006c49] group-hover/btn:text-white"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        bookmark
                      </span>
                    </button>

                    {/* SDG Tags on Image Bottom */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1.5 flex-wrap">
                      {p.sdgs.map((s) => (
                        <span
                          key={s.num}
                          className="px-2 py-0.5 rounded-md text-white text-[10px] font-bold shadow-xs"
                          style={{ backgroundColor: s.color }}
                        >
                          SDG {s.num} {s.label}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5">
                    <div className="flex items-center justify-between text-[11px] text-[#707974] mb-2">
                      <span className="flex items-center gap-1 text-[#006c49] font-semibold">
                        <span className="material-symbols-outlined text-xs">verified</span>
                        {p.verified || 'Terverifikasi Bappenas'}
                      </span>
                      {p.urgent && (
                        <span className="px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#ba1a1a] font-bold text-[10px]">
                          Mendesak
                        </span>
                      )}
                    </div>

                    <h3
                      onClick={() => onSelectProject ? onSelectProject(p) : onNavigate('detail-proyek')}
                      className="text-base font-bold text-[#0b1c30] group-hover:text-[#006c49] transition-colors leading-snug line-clamp-2 cursor-pointer mb-2"
                    >
                      {p.title}
                    </h3>
                    <p className="text-xs text-[#404944] line-clamp-2 leading-relaxed mb-4">
                      {p.description}
                    </p>

                    {/* Funding Progress Meter */}
                    <div className="bg-[#f0f4f9] p-3 rounded-xl border border-[#e5eeff] mb-4">
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-[#707974]">
                          Terkumpul: <strong className="text-[#003828] font-bold">Rp {formatRp(p.collected)}</strong>
                        </span>
                        <span className="text-[#006c49] font-bold">{p.percent}%</span>
                      </div>
                      <div className="w-full bg-[#d0dbe7] h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#006c49] h-full rounded-full transition-all duration-500"
                          style={{ width: `${p.percent}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-[11px] text-[#707974] mt-1.5">
                        <span>Target: Rp {formatRp(p.target)}</span>
                        <span>{p.daysLeft || 45} Hari Tersisa</span>
                      </div>
                    </div>

                    {/* Volunteer Info */}
                    <div className="flex items-center justify-between text-xs text-[#404944]">
                      <span className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-sm text-[#006c49]">groups</span>
                        <span>Kebutuhan Relawan: <strong className="text-[#0b1c30]">{p.volunteers}</strong></span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="p-5 pt-0 border-t border-[#f0f4f9] mt-2">
                  <div className="flex items-center gap-2 pt-3">
                    <button
                      onClick={() => onSelectProject ? onSelectProject(p) : onNavigate('detail-proyek')}
                      className="flex-1 py-2.5 rounded-xl bg-[#0d503c] hover:bg-[#003828] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>Lihat Detail</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>

                    <button
                      onClick={() => onDonate ? onDonate(p) : onNavigate('pembayaran')}
                      className="flex-1 py-2.5 rounded-xl bg-[#6cf8bb] hover:bg-[#5ae6aa] text-[#003828] text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">volunteer_activism</span>
                      <span>Donasi</span>
                    </button>

                    <button
                      onClick={(e) => handleShare(p, e)}
                      title="Salin tautan proyek"
                      className="p-2.5 rounded-xl bg-[#eff4ff] hover:bg-[#e0e9f8] text-[#404944] hover:text-[#003828] transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[17px]">
                        {copiedId === p.id ? 'check' : 'share'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Modal to Clear All */}
      {confirmClearOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-[#e5eeff] text-center">
            <div className="w-12 h-12 rounded-full bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center mx-auto mb-3">
              <span className="material-symbols-outlined text-2xl">delete_sweep</span>
            </div>
            <h3 className="text-base font-bold text-[#0b1c30] mb-1">Kosongkan Semua Koleksi?</h3>
            <p className="text-xs text-[#404944] leading-relaxed mb-5">
              Semua proyek yang Anda simpan akan dihapus dari daftar penyimpanan. Anda dapat menyimpannya kembali kapan saja saat menjelajahi proyek.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmClearOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#eff4ff] hover:bg-[#e0e9f8] text-[#404944] text-xs font-semibold transition-all"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  savedProjects.forEach((p) => onToggleSave(p.id));
                  setConfirmClearOpen(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#ba1a1a] hover:bg-[#93000a] text-white text-xs font-bold transition-all shadow-sm"
              >
                Ya, Kosongkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
