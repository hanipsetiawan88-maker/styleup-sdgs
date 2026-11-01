import { useState, useMemo } from 'react';
import { PROJECTS, SDG_COLORS } from '../data';

export default function EksplorasiPage({ onNavigate, onSelectProject, onDonate }) {
  // Filter States
  const [search, setSearch] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedCluster, setSelectedCluster] = useState('Semua');
  const [selectedSDGs, setSelectedSDGs] = useState([2, 3, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
  const [maxFunding, setMaxFunding] = useState(600); // in millions
  const [filterVolunteers, setFilterVolunteers] = useState(true);
  const [filterDonation, setFilterDonation] = useState(true);
  const [filterCSR, setFilterCSR] = useState(false);
  const [sortBy, setSortBy] = useState('recommend');
  const [viewMode, setViewMode] = useState('grid');
  const [currentPageNum, setCurrentPageNum] = useState(1);

  const itemsPerPage = 6;

  // Spotlight Project Data
  const spotlightProject = {
    id: 999,
    title: 'Pembangunan Rumah Baca Desa Sukamaju',
    location: 'Kec. Cikembar, Sukabumi, Jawa Barat',
    description: 'Membangun sentra literasi ramah anak berbasis bambu lokal serta laboratorium komputer surya terdesentralisasi bagi 420 murid di wilayah pegunungan Sukabumi selatan.',
    collected: 112500000,
    target: 150000000,
    percent: 75,
    volunteers: '8 / 12 Posisi',
    daysLeft: 14,
    verified: 'Terverifikasi Bappenas',
    sdgs: [
      { num: 4, label: 'Pendidikan Berkualitas', color: '#E5243B' },
      { num: 11, label: 'Komunitas Berkelanjutan', color: '#FD6925' },
    ],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6793sFH6AK0aNkF7WMvFAFVzvhZnUJQUVmyzrGwWoFIp3G1N-qEge0RcSHWW-xXadWLQ3qeUdM14oLA-tv1vQJ72hvCt2YVt-2ysort_OIg2w2FznSysFGdYEYSKOynpLpqu2WLfxytoKVnh56HglSl2Pgxp1qY7yQIhPtaA_vMtieIo7GlnyLbm3zziMpMhF3UDqBYWx2q3UwSWFJwlQ9SiqeCt6vTqiDXOyCNmncfWESlw-UZbP',
  };

  // Toggle SDG selection in filter
  const toggleSDG = (num) => {
    setSelectedSDGs(prev =>
      prev.includes(num) ? prev.filter(n => n !== num) : [...prev, num]
    );
    setCurrentPageNum(1);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearch('');
    setSelectedProvince('');
    setSelectedCluster('Semua');
    setSelectedSDGs([2, 3, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
    setMaxFunding(600);
    setFilterVolunteers(true);
    setFilterDonation(true);
    setFilterCSR(false);
    setSortBy('recommend');
    setCurrentPageNum(1);
  };

  // Filtered & Sorted Projects
  const filteredProjects = useMemo(() => {
    return PROJECTS.filter(p => {
      // Search matching
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesQ = p.title.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q);
        if (!matchesQ) return false;
      }

      // Province matching
      if (selectedProvince) {
        if (!p.location.toLowerCase().includes(selectedProvince.toLowerCase())) return false;
      }

      // Cluster matching
      if (selectedCluster !== 'Semua') {
        const clusterMap = {
          'Pendidikan': [4, 8, 10],
          'Lingkungan': [13, 14, 15, 6],
          'Kesehatan': [3, 2, 6],
          'Ekonomi Sirkular': [7, 8, 9, 11, 12],
        };
        const targetNums = clusterMap[selectedCluster] || [];
        const hasMatchingSDG = p.sdgs.some(s => targetNums.includes(s.num));
        if (!hasMatchingSDG) return false;
      }

      // SDG check
      if (selectedSDGs.length > 0) {
        const hasMatchingSDG = p.sdgs.some(s => selectedSDGs.includes(s.num));
        if (!hasMatchingSDG) return false;
      }

      // Max funding filter (target in millions)
      const targetInMillions = p.target / 1000000;
      if (targetInMillions > maxFunding) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'urgent') return a.daysLeft - b.daysLeft;
      if (sortBy === 'percent') return b.percent - a.percent;
      if (sortBy === 'newest') return b.id - a.id;
      return 0; // recommend default
    });
  }, [search, selectedProvince, selectedCluster, selectedSDGs, maxFunding, sortBy]);

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / itemsPerPage));
  const safePageNum = Math.min(Math.max(1, currentPageNum), totalPages);

  const paginatedProjects = useMemo(() => {
    const start = (safePageNum - 1) * itemsPerPage;
    return filteredProjects.slice(start, start + itemsPerPage);
  }, [filteredProjects, safePageNum, itemsPerPage]);

  const startItem = filteredProjects.length === 0 ? 0 : (safePageNum - 1) * itemsPerPage + 1;
  const endItem = Math.min(safePageNum * itemsPerPage, filteredProjects.length);

  const handleSelect = (project) => {
    if (onSelectProject) onSelectProject(project);
    else onNavigate('detail-proyek');
  };

  const handleDonateAction = (project) => {
    if (onDonate) onDonate(project);
    else onNavigate('pembayaran');
  };

  const handlePageChange = (newPage) => {
    setCurrentPageNum(newPage);
    document.getElementById('project-feed-top')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Define themes for each page of projects to make navigation intuitive
  const pageThemes = [
    { page: 1, title: 'Isu Konservasi Pesisir, Pendidikan 3T & Kebakaran Gambut', icon: 'forest' },
    { page: 2, title: 'Isu Literasi Digital, Rob Pantura, Stunting & Bank Sampah', icon: 'psychology' },
    { page: 3, title: 'Isu Krisis Air Dayak, Pencemaran Laut & Ambulans Natuna', icon: 'water_drop' },
    { page: 4, title: 'Isu Satwa Endemik, Reboisasi Citarum & Sekolah Apung Bajo', icon: 'eco' },
  ];

  return (
    <main className="flex-1 w-full bg-[#f8f9ff]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">

        {/* Header Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-[#404944]">
            <button onClick={() => onNavigate('beranda')} className="hover:text-[#003828] transition-colors font-medium">Beranda</button>
            <span className="material-symbols-outlined text-sm text-[#707974]">chevron_right</span>
            <span className="font-bold text-[#006c49]">Eksplorasi Inisiatif Berkelanjutan</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6cf8bb]/30 text-[#00513b] text-xs font-semibold border border-[#6cf8bb]/40">
              <span className="material-symbols-outlined text-xs">verified</span> 100% Audit Kemitraan GRI & Bappenas
            </span>
          </div>
        </div>

        {/* Header Eksplorasi & Statistik Makro (Dark Green Gradient) */}
        <header className="relative rounded-2xl p-6 sm:p-8 bg-gradient-to-br from-[#003828] via-[#0d503c] to-[#00513b] text-white shadow-lg overflow-hidden">
          <div className="absolute -right-20 -top-24 w-96 h-96 rounded-full bg-[#6cf8bb]/10 blur-3xl pointer-events-none" />
          <div className="absolute right-1/3 -bottom-20 w-80 h-80 rounded-full bg-[#a3f6cf]/10 blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md mb-3 text-[#6cf8bb] text-xs font-semibold">
                <span className="material-symbols-outlined text-sm">explore</span>
                <span className="uppercase tracking-wider">Aksi Daerah Menuju Target 2030</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
                Eksplorasi Proyek di Kota & Daerah Anda
              </h1>
              <p className="text-sm sm:text-base text-white/80 mt-2 leading-relaxed">
                Temukan inisiatif terverifikasi Bappenas di 38 provinsi, salurkan kontribusi terukur, atau ambil peran nyata langsung sebagai relawan garda depan.
              </p>
            </div>

            {/* Quick Stats Pods */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto shrink-0">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 min-w-[150px] border border-white/15">
                <div className="flex items-center justify-between text-[#6cf8bb] mb-1">
                  <span className="text-[11px] uppercase tracking-wide font-semibold">Inisiatif Aktif</span>
                  <span className="material-symbols-outlined text-lg">flag</span>
                </div>
                <div className="text-2xl font-bold text-white">128</div>
                <div className="text-[11px] text-white/70 flex items-center gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-xs text-[#6cf8bb]">check_circle</span> Terdaftar Resmi
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 min-w-[150px] border border-white/15">
                <div className="flex items-center justify-between text-[#6cf8bb] mb-1">
                  <span className="text-[11px] uppercase tracking-wide font-semibold">Penyaluran</span>
                  <span className="material-symbols-outlined text-lg">payments</span>
                </div>
                <div className="text-2xl font-bold text-white">Rp 14,8 M</div>
                <div className="text-[11px] text-white/70 flex items-center gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-xs text-[#6cf8bb]">trending_up</span> Realisasi 2025/2026
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 min-w-[150px] border border-white/15">
                <div className="flex items-center justify-between text-[#6cf8bb] mb-1">
                  <span className="text-[11px] uppercase tracking-wide font-semibold">Relawan Lapangan</span>
                  <span className="material-symbols-outlined text-lg">groups</span>
                </div>
                <div className="text-2xl font-bold text-white">2.450+</div>
                <div className="text-[11px] text-white/70 flex items-center gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-xs text-[#6cf8bb]">verified</span> Kontributor Terjun
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main 12-Column Content Layout: 3-col Faceted Sticky Filter + 9-col Feed */}
        <div className="grid grid-cols-12 gap-6 items-start">

          {/* Sticky Left Filter (3 Columns) */}
          <aside className="col-span-12 lg:col-span-3 lg:sticky lg:top-24 z-10">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e5eeff] flex flex-col gap-5">
              
              {/* Filter Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#e5eeff]">
                <div className="flex items-center gap-2 text-[#003828] font-bold text-base">
                  <span className="material-symbols-outlined text-xl">tune</span>
                  <span>Filter Proyek</span>
                </div>
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-[#006c49] hover:text-[#003828] font-semibold transition-colors cursor-pointer"
                >
                  Atur Ulang
                </button>
              </div>

              {/* Keyword Search */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] text-[#707974] uppercase tracking-wider font-bold">Kata Kunci</label>
                <div className="relative w-full">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#707974] text-base">search</span>
                  <input
                    type="text"
                    value={search}
                    onChange={e => { setSearch(e.target.value); setCurrentPageNum(1); }}
                    placeholder="Cari nama, kota, isu..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#f0f4f9] text-xs text-[#0b1c30] placeholder:text-[#707974] focus:outline-none focus:ring-2 focus:ring-[#006c49]/30 transition-all border border-transparent"
                  />
                </div>
              </div>

              {/* Province / City Select */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] text-[#707974] uppercase tracking-wider font-bold">Provinsi & Wilayah</label>
                <div className="relative">
                  <select
                    value={selectedProvince}
                    onChange={e => { setSelectedProvince(e.target.value); setCurrentPageNum(1); }}
                    className="w-full appearance-none px-3 py-2 rounded-xl bg-[#f0f4f9] text-xs text-[#0b1c30] pr-8 focus:outline-none focus:ring-2 focus:ring-[#006c49]/30 cursor-pointer border border-transparent font-medium"
                  >
                    <option value="">Semua Wilayah Indonesia</option>
                    <option value="Jawa Barat">Jawa Barat (Bandung, Sukabumi, Bekasi)</option>
                    <option value="Jawa Timur">Jawa Timur (Banyuwangi, Malang, Surabaya)</option>
                    <option value="Jawa Tengah">Jawa Tengah (Semarang, Kudus, Solo)</option>
                    <option value="Banten">Banten (Pandeglang, Lebak)</option>
                    <option value="Yogyakarta">DI Yogyakarta (Kulon Progo)</option>
                    <option value="Nusa Tenggara Barat">Nusa Tenggara Barat (Lombok)</option>
                    <option value="Nusa Tenggara Timur">Nusa Tenggara Timur (Sikka, Sumba, Flores)</option>
                    <option value="Kalimantan">Kalimantan (Kutai, Palangka Raya, Meratus)</option>
                    <option value="Sulawesi">Sulawesi (Wakatobi, Torosiaje)</option>
                    <option value="Maluku">Maluku (Ambon)</option>
                    <option value="Papua">Papua & Papua Barat (Jayawijaya, Tambrauw)</option>
                    <option value="Riau">Riau & Kepulauan Riau (Natuna, Siak)</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[#707974] pointer-events-none text-base">expand_more</span>
                </div>
              </div>

              {/* Klaster Utama */}
              <div className="flex flex-col gap-2">
                <label className="text-[11px] text-[#707974] uppercase tracking-wider font-bold">Klaster Utama</label>
                <div className="flex flex-wrap gap-1.5">
                  {['Semua', 'Pendidikan', 'Lingkungan', 'Kesehatan', 'Ekonomi Sirkular'].map(cluster => (
                    <button
                      key={cluster}
                      onClick={() => { setSelectedCluster(cluster); setCurrentPageNum(1); }}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                        selectedCluster === cluster
                          ? 'bg-[#0d503c] text-white shadow-sm'
                          : 'bg-[#f0f4f9] text-[#404944] hover:bg-[#e5eeff]'
                      }`}
                    >
                      {cluster}
                    </button>
                  ))}
                </div>
              </div>

              {/* Checklist 17 Target SDGs */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] text-[#707974] uppercase tracking-wider font-bold">Target SDGs Terkait</label>
                  <span className="text-[11px] text-[#006c49] font-bold">17 Pilar</span>
                </div>
                <div className="max-h-44 overflow-y-auto space-y-1 pr-1 text-xs">
                  {[
                    { num: 2, name: 'Tanpa Kelaparan', color: '#DDA63A' },
                    { num: 3, name: 'Kehidupan Sehat', color: '#4C9F38' },
                    { num: 4, name: 'Pendidikan Berkualitas', color: '#C5192D' },
                    { num: 6, name: 'Air Bersih & Sanitasi', color: '#26BDE2' },
                    { num: 7, name: 'Energi Bersih', color: '#FCC30B' },
                    { num: 8, name: 'Pekerjaan Layak', color: '#A21942' },
                    { num: 9, name: 'Infrastruktur & Inovasi', color: '#FD6925' },
                    { num: 10, name: 'Kurangi Kesenjangan', color: '#DD1367' },
                    { num: 11, name: 'Kota & Komunitas', color: '#FD9D24' },
                    { num: 12, name: 'Konsumsi Bertanggung Jawab', color: '#BF8B2E' },
                    { num: 13, name: 'Penanganan Iklim', color: '#3F7E44' },
                    { num: 14, name: 'Ekosistem Laut', color: '#0A97D9' },
                    { num: 15, name: 'Ekosistem Daratan', color: '#56C02B' },
                    { num: 16, name: 'Perdamaian & Keadilan', color: '#00689D' },
                  ].map(s => {
                    const isChecked = selectedSDGs.includes(s.num);
                    return (
                      <label
                        key={s.num}
                        onClick={() => toggleSDG(s.num)}
                        className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-[#f0f4f9] cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}} // handled by parent
                          className="w-3.5 h-3.5 rounded text-[#0d503c] accent-[#0d503c] cursor-pointer"
                        />
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                        <span className="text-[#0b1c30] truncate text-[11px] font-medium">SDG {s.num}: {s.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Slider Rentang Pendanaan */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] text-[#707974] uppercase tracking-wider font-bold">Kebutuhan Dana</label>
                  <span className="text-xs font-bold text-[#006c49]">
                    {maxFunding >= 1000 ? 'Maks. Rp 1 Miliar+' : `Maks. Rp ${maxFunding} Juta`}
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="1000"
                  step="50"
                  value={maxFunding}
                  onChange={e => { setMaxFunding(Number(e.target.value)); setCurrentPageNum(1); }}
                  className="w-full accent-[#0d503c] cursor-pointer bg-[#e5eeff] rounded-lg h-2"
                />
                <div className="flex justify-between text-[10px] text-[#707974]">
                  <span>Rp 50 Jt</span>
                  <span>Rp 500 Jt</span>
                  <span>Rp 1 M+</span>
                </div>
              </div>

              {/* Kebutuhan Kontribusi */}
              <div className="flex flex-col gap-2">
                <label className="text-[11px] text-[#707974] uppercase tracking-wider font-bold">Kebutuhan Kontribusi</label>
                <div className="space-y-1.5 text-xs text-[#0b1c30]">
                  <label className="flex items-center gap-2 cursor-pointer hover:text-[#006c49]">
                    <input
                      type="checkbox"
                      checked={filterVolunteers}
                      onChange={e => setFilterVolunteers(e.target.checked)}
                      className="w-3.5 h-3.5 rounded accent-[#0d503c] cursor-pointer"
                    />
                    <span>Membuka Relawan (Hands-on)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer hover:text-[#006c49]">
                    <input
                      type="checkbox"
                      checked={filterDonation}
                      onChange={e => setFilterDonation(e.target.checked)}
                      className="w-3.5 h-3.5 rounded accent-[#0d503c] cursor-pointer"
                    />
                    <span>Pendanaan Terbuka (Donasi)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer hover:text-[#006c49]">
                    <input
                      type="checkbox"
                      checked={filterCSR}
                      onChange={e => setFilterCSR(e.target.checked)}
                      className="w-3.5 h-3.5 rounded accent-[#0d503c] cursor-pointer"
                    />
                    <span>Kemitraan Korporasi / CSR</span>
                  </label>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handlePageChange(1)}
                className="w-full py-2.5 px-4 bg-[#0d503c] hover:bg-[#003828] text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-base">filter_alt</span>
                Terapkan Filter
              </button>
            </div>
          </aside>

          {/* Right Column: Projects Feed (9 Columns) */}
          <section className="col-span-12 lg:col-span-9 flex flex-col gap-6" id="project-feed-top">

            {/* Menu Navigasi Isu Permasalahan Per Halaman */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#e5eeff] flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#003828] uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base text-[#006c49]">category</span>
                  Pilih Menu Permasalahan & Isu Prioritas
                </span>
                <span className="text-[11px] text-[#707974] font-medium">Halaman {safePageNum} dari {totalPages}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                {pageThemes.map(theme => (
                  <button
                    key={theme.page}
                    onClick={() => handlePageChange(theme.page)}
                    className={`p-3 rounded-xl text-left border transition-all flex flex-col justify-between gap-1.5 ${
                      safePageNum === theme.page
                        ? 'bg-[#0d503c] text-white border-[#0d503c] shadow-md ring-2 ring-[#0d503c]/20'
                        : 'bg-[#f0f4f9] text-[#0b1c30] border-transparent hover:bg-[#e5eeff]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        safePageNum === theme.page ? 'bg-white/20 text-[#6cf8bb]' : 'bg-[#e5eeff] text-[#006c49]'
                      }`}>
                        Halaman {theme.page}
                      </span>
                      <span className={`material-symbols-outlined text-base ${
                        safePageNum === theme.page ? 'text-[#6cf8bb]' : 'text-[#707974]'
                      }`}>
                        {theme.icon}
                      </span>
                    </div>
                    <span className="text-xs font-semibold leading-snug line-clamp-2">
                      {theme.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Control Bar */}
            <div className="bg-white p-3.5 sm:px-5 rounded-2xl shadow-sm border border-[#e5eeff] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0b1c30]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#006c49]" />
                <span>
                  Menampilkan {startItem} - {endItem} dari {filteredProjects.length} Proyek Terverifikasi
                </span>
                <span className="ml-1 px-2 py-0.5 rounded-full bg-[#6cf8bb]/30 text-[#00513b] text-[10px] font-bold">
                  Halaman {safePageNum} / {totalPages}
                </span>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                {/* Dropdown Sorting */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    className="appearance-none pl-3 pr-8 py-2 bg-[#f0f4f9] rounded-xl text-[#0b1c30] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#006c49]/30 cursor-pointer border border-transparent"
                  >
                    <option value="recommend">Rekomendasi Utama</option>
                    <option value="urgent">Kebutuhan Mendesak</option>
                    <option value="percent">Dana Paling Mendekati Target</option>
                    <option value="newest">Terbaru Diluncurkan</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[#707974] pointer-events-none text-base">expand_more</span>
                </div>

                {/* View Toggle */}
                <div className="flex items-center p-1 bg-[#f0f4f9] rounded-xl">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg transition-all ${
                      viewMode === 'grid'
                        ? 'bg-white text-[#003828] shadow-sm font-bold'
                        : 'text-[#707974] hover:text-[#0b1c30]'
                    }`}
                    title="Tampilan Grid"
                  >
                    <span className="material-symbols-outlined text-lg">grid_view</span>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-lg transition-all ${
                      viewMode === 'list'
                        ? 'bg-white text-[#003828] shadow-sm font-bold'
                        : 'text-[#707974] hover:text-[#0b1c30]'
                    }`}
                    title="Tampilan List"
                  >
                    <span className="material-symbols-outlined text-lg">view_list</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Spotlight Banner Bento Proyek Utama (Rumah Baca Sukamaju) - Disajikan di Halaman 1 */}
            {safePageNum === 1 && (
              <section className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#e5eeff] group">
                <div className="grid grid-cols-1 lg:grid-cols-12">
                  {/* Hero Bento Visual */}
                  <div className="lg:col-span-7 relative min-h-[260px] lg:min-h-full overflow-hidden">
                    <img
                      src={spotlightProject.image}
                      alt={spotlightProject.title}
                      onError={(e) => { e.currentTarget.src = '/delta-mahakam.jpg'; }}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#003828]/95 via-[#003828]/40 to-transparent" />
                    
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                      <span className="px-3 py-1 rounded-full bg-[#6cf8bb] text-[#003828] text-xs font-bold flex items-center gap-1 shadow-sm">
                        <span className="material-symbols-outlined text-xs">verified</span> {spotlightProject.verified}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur text-[#003828] text-xs font-semibold shadow-sm">
                        Spotlight Utama Bulan Ini
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <div className="flex items-center gap-1.5 mb-1 text-[#6cf8bb]">
                        <span className="material-symbols-outlined text-sm">location_on</span>
                        <span className="text-xs font-semibold">{spotlightProject.location}</span>
                      </div>
                      <h2 className="text-lg sm:text-xl font-bold text-white leading-tight">
                        {spotlightProject.title}
                      </h2>
                    </div>
                  </div>

                  {/* Info & Quick Action */}
                  <div className="lg:col-span-5 p-5 sm:p-6 flex flex-col justify-between bg-white gap-4">
                    <div>
                      {/* SDG Badges */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {spotlightProject.sdgs.map(s => (
                          <span
                            key={s.num}
                            className="px-2.5 py-1 rounded-lg text-white text-[11px] font-bold flex items-center gap-1 shadow-sm"
                            style={{ backgroundColor: s.color }}
                          >
                            <span>SDG {s.num}</span> <span>{s.label}</span>
                          </span>
                        ))}
                      </div>

                      <p className="text-xs text-[#404944] leading-relaxed mb-4">
                        {spotlightProject.description}
                      </p>

                      {/* Progress & Dana Metrics */}
                      <div className="bg-[#f0f4f9] p-3.5 rounded-xl mb-3 border border-[#e5eeff]">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs text-[#404944] font-medium">Progres Pendanaan Gotong Royong</span>
                          <span className="text-sm font-bold text-[#003828]">{spotlightProject.percent}%</span>
                        </div>
                        <div className="w-full bg-[#d0dbe7] h-2 rounded-full overflow-hidden mb-2">
                          <div
                            className="bg-[#006c49] h-full rounded-full transition-all duration-700"
                            style={{ width: `${spotlightProject.percent}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[11px]">
                          <div>
                            <span className="text-[#707974]">Terkumpul: </span>
                            <span className="font-bold text-[#003828]">Rp 112.500.000</span>
                          </div>
                          <div>
                            <span className="text-[#707974]">Target: </span>
                            <span className="font-semibold text-[#0b1c30]">Rp 150.000.000</span>
                          </div>
                        </div>
                      </div>

                      {/* Relawan Status Bar */}
                      <div className="flex items-center justify-between text-xs text-[#404944]">
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[#006c49] text-base">person_add</span>
                          <span>Kebutuhan Relawan: <strong className="text-[#0b1c30]">{spotlightProject.volunteers}</strong></span>
                        </div>
                        <span className="text-[#ba1a1a] font-bold flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">hourglass_top</span> {spotlightProject.daysLeft} Hari Lagi
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 pt-2">
                      <button
                        onClick={() => handleDonateAction(spotlightProject)}
                        className="flex-1 py-2.5 px-4 bg-[#0d503c] hover:bg-[#003828] text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
                      >
                        <span className="material-symbols-outlined text-base">volunteer_activism</span>
                        <span>Donasi Langsung</span>
                      </button>
                      <button
                        onClick={() => handleSelect(spotlightProject)}
                        className="py-2.5 px-4 bg-[#6cf8bb]/30 text-[#00513b] hover:bg-[#6cf8bb]/50 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1"
                      >
                        <span>Gabung Relawan</span>
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Project Cards Grid / List */}
            {paginatedProjects.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center text-[#707974] shadow-sm border border-[#e5eeff]">
                <span className="material-symbols-outlined text-5xl mb-2 text-[#bfc9c2]">travel_explore</span>
                <p className="text-sm font-semibold">Tidak ada proyek yang sesuai dengan kriteria filter.</p>
                <button
                  onClick={handleResetFilters}
                  className="mt-4 px-4 py-2 rounded-xl bg-[#0d503c] text-white text-xs font-bold hover:bg-[#003828] transition-all"
                >
                  Reset Semua Filter
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              /* GRID VIEW */
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {paginatedProjects.map(p => (
                  <article
                    key={p.id}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between border border-[#e5eeff] hover:border-[#6cf8bb]/60 group"
                  >
                    <div>
                      {/* Image Thumbnail */}
                      <div className="relative h-44 overflow-hidden">
                        <img
                          src={p.image}
                          alt={p.title}
                          onError={(e) => { e.currentTarget.src = '/delta-mahakam.jpg'; }}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur shadow-xs text-[11px] text-[#0b1c30] font-semibold flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs text-[#006c49]">location_on</span>
                          <span className="truncate max-w-[140px]">{p.location}</span>
                        </span>
                        <div className="absolute top-3 right-3 flex items-center gap-1">
                          {p.sdgs.map(s => (
                            <span
                              key={s.num}
                              className="px-2 py-0.5 rounded-full text-white text-[10px] font-bold shadow-xs"
                              style={{ backgroundColor: s.color }}
                            >
                              SDG {s.num}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Content Body */}
                      <div className="p-4">
                        <div className="flex items-center gap-1.5 mb-2 text-[11px] flex-wrap">
                          <span className="px-2 py-0.5 rounded-full bg-[#6cf8bb]/30 text-[#00513b] font-bold">
                            {p.sdgs[0]?.label || 'Inisiatif'}
                          </span>
                          <span className="text-[#bfc9c2]">•</span>
                          {p.urgencyLevel === 'mendesak' ? (
                            <span className="px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#ba1a1a] font-extrabold flex items-center gap-1 text-[10px]">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a] animate-ping" /> Mendesak
                            </span>
                          ) : p.urgencyLevel === 'urgent' || p.urgent ? (
                            <span className="px-2 py-0.5 rounded-full bg-[#fef3c7] text-[#92400e] font-extrabold flex items-center gap-1 text-[10px]">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#d97706]" /> Urgent
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-[#edf9f3] text-[#00513b] font-semibold text-[10px]">
                              Biasa
                            </span>
                          )}
                          <span className="text-[#bfc9c2]">•</span>
                          <span className="text-[#707974] font-medium">{p.verified}</span>
                        </div>

                        <h3
                          onClick={() => handleSelect(p)}
                          className="text-sm font-bold text-[#0b1c30] group-hover:text-[#006c49] transition-colors leading-snug line-clamp-2 cursor-pointer"
                        >
                          {p.title}
                        </h3>
                        <p className="text-xs text-[#404944] mt-1.5 line-clamp-2 leading-relaxed">
                          {p.description}
                        </p>
                      </div>
                    </div>

                    {/* Footer Metrics & Actions */}
                    <div className="p-4 pt-0">
                      <div className="mb-3 bg-[#f0f4f9] p-2.5 rounded-xl border border-[#e5eeff]">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-[#707974]">Terkumpul: <strong className="text-[#003828] font-bold">Rp {(p.collected / 1000000).toFixed(0)} Jt</strong></span>
                          <span className="text-[#006c49] font-bold">{p.percent}%</span>
                        </div>
                        <div className="w-full bg-[#d0dbe7] h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-[#006c49] h-full rounded-full transition-all duration-500"
                            style={{ width: `${p.percent}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-[#e5eeff] text-xs">
                        <span className="text-[#404944] flex items-center gap-1">
                          <span className="material-symbols-outlined text-base text-[#006c49]">groups</span>
                          <span><strong>{p.volunteers}</strong> Relawan</span>
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleSelect(p)}
                            className="text-[#003828] hover:text-[#006c49] font-bold flex items-center gap-0.5 transition-colors text-xs"
                          >
                            Detail <span className="material-symbols-outlined text-sm">chevron_right</span>
                          </button>
                          <button
                            onClick={() => handleDonateAction(p)}
                            className="px-2.5 py-1 rounded-lg bg-[#0d503c] hover:bg-[#003828] text-white text-[11px] font-bold transition-all shadow-xs flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-xs">favorite</span>
                            Donasi
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              /* LIST VIEW - Compact, Balanced, No Vertical Blank Gaps */
              <div className="flex flex-col gap-4">
                {paginatedProjects.map(p => (
                  <article
                    key={p.id}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-[#e5eeff] hover:border-[#6cf8bb]/60 flex flex-col sm:flex-row items-stretch group"
                  >
                    {/* Fixed bounded image container to avoid flex stretch gaps */}
                    <div className="relative w-full sm:w-72 sm:min-w-[280px] h-48 sm:h-auto shrink-0 overflow-hidden bg-[#e5eeff]">
                      <img
                        src={p.image}
                        alt={p.title}
                        onError={(e) => { e.currentTarget.src = '/delta-mahakam.jpg'; }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur shadow-xs text-[11px] text-[#0b1c30] font-semibold flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs text-[#006c49]">location_on</span>
                        <span className="truncate max-w-[140px]">{p.location}</span>
                      </span>
                      <div className="absolute top-3 right-3 flex items-center gap-1">
                        {p.sdgs.map(s => (
                          <span
                            key={s.num}
                            className="px-2 py-0.5 rounded-full text-white text-[10px] font-bold shadow-xs"
                            style={{ backgroundColor: s.color }}
                          >
                            SDG {s.num}
                          </span>
                        ))}
                      </div>
                      <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-[11px] bg-[#003828]/80 backdrop-blur-sm px-2.5 py-1 rounded-lg">
                        <span className="truncate">{p.verified}</span>
                        <span className="font-bold text-[#6cf8bb] whitespace-nowrap">Sisa {p.daysLeft} Hari</span>
                      </div>
                    </div>

                    {/* Content Section - Compact and properly distributed */}
                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5 text-[11px]">
                          <span className="px-2 py-0.5 rounded-full bg-[#6cf8bb]/30 text-[#00513b] font-bold">
                            {p.sdgs[0]?.label || 'Inisiatif'}
                          </span>
                          <span className="text-[#bfc9c2]">•</span>
                          <span className="text-[#707974] font-medium">{p.location}</span>
                        </div>

                        <h3
                          onClick={() => handleSelect(p)}
                          className="text-base font-bold text-[#0b1c30] group-hover:text-[#006c49] transition-colors leading-snug line-clamp-2 cursor-pointer mb-1.5"
                        >
                          {p.title}
                        </h3>
                        <p className="text-xs text-[#404944] line-clamp-2 leading-relaxed">
                          {p.description}
                        </p>
                      </div>

                      {/* Middle Progress & Relawan */}
                      <div className="bg-[#f0f4f9] p-3 rounded-xl border border-[#e5eeff] flex flex-col gap-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-[#707974]">
                            Terkumpul: <strong className="text-[#003828] font-bold">Rp {(p.collected / 1000000).toFixed(0)} Jt</strong>
                            <span className="text-[#707974] font-normal"> / Target Rp {(p.target / 1000000).toFixed(0)} Jt</span>
                          </span>
                          <span className="text-[#006c49] font-bold">{p.percent}%</span>
                        </div>
                        <div className="w-full bg-[#d0dbe7] h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-[#006c49] h-full rounded-full transition-all duration-500"
                            style={{ width: `${p.percent}%` }}
                          />
                        </div>
                        <div className="flex justify-between items-center text-[11px] text-[#404944] pt-0.5">
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs text-[#006c49]">groups</span>
                            <span>Relawan: <strong>{p.volunteers}</strong></span>
                          </span>
                          <span className="text-[#707974]">{p.daysLeft} hari tersisa</span>
                        </div>
                      </div>

                      {/* Bottom Actions */}
                      <div className="flex items-center justify-end gap-2 pt-1 border-t border-[#e5eeff]">
                        <button
                          onClick={() => handleSelect(p)}
                          className="px-4 py-2 rounded-xl bg-[#eff4ff] hover:bg-[#e5eeff] text-[#003828] text-xs font-bold transition-all text-center"
                        >
                          Detail Proyek
                        </button>
                        <button
                          onClick={() => handleDonateAction(p)}
                          className="px-4 py-2 rounded-xl bg-[#0d503c] hover:bg-[#003828] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                        >
                          <span className="material-symbols-outlined text-sm">volunteer_activism</span>
                          Donasi Sekarang
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* Paginasi Interaktif Dinamis */}
            <nav aria-label="Paginasi" className="bg-white p-4 rounded-2xl shadow-sm border border-[#e5eeff] flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-[#404944]">
                Menampilkan <span className="font-semibold text-[#0b1c30]">{startItem} - {endItem}</span> dari <span className="font-semibold text-[#0b1c30]">{filteredProjects.length}</span> inisiatif
              </div>
              <div className="flex items-center gap-1.5">
                {/* Previous Button */}
                <button
                  disabled={safePageNum <= 1}
                  onClick={() => handlePageChange(safePageNum - 1)}
                  className="p-1.5 rounded-xl bg-[#f0f4f9] text-[#707974] hover:text-[#0b1c30] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  title="Halaman Sebelumnya"
                >
                  <span className="material-symbols-outlined text-base">chevron_left</span>
                </button>

                {/* Page Number Buttons */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                  <button
                    key={num}
                    onClick={() => handlePageChange(num)}
                    className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                      safePageNum === num
                        ? 'bg-[#0d503c] text-white shadow-md ring-2 ring-[#0d503c]/20'
                        : 'bg-[#f0f4f9] text-[#0b1c30] hover:bg-[#e5eeff]'
                    }`}
                  >
                    {num}
                  </button>
                ))}

                {/* Next Button */}
                <button
                  disabled={safePageNum >= totalPages}
                  onClick={() => handlePageChange(safePageNum + 1)}
                  className="p-1.5 rounded-xl bg-[#f0f4f9] text-[#0b1c30] hover:bg-[#e5eeff] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  title="Halaman Berikutnya"
                >
                  <span className="material-symbols-outlined text-base">chevron_right</span>
                </button>
              </div>
            </nav>

            {/* Bottom Conversion Banner (Pendaftaran Proyek Baru) */}
            <section className="rounded-2xl p-6 sm:p-7 bg-gradient-to-r from-[#f0f4f9] via-white to-[#f0f4f9] border border-[#e5eeff] shadow-sm flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#6cf8bb]/30 text-[#00513b] flex items-center justify-center shrink-0 shadow-xs border border-[#6cf8bb]/40">
                  <span className="material-symbols-outlined text-3xl">add_moderator</span>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg text-[#003828] font-bold">
                    Punya Inisiatif Berkelanjutan di Komunitas Anda?
                  </h3>
                  <p className="text-xs text-[#404944] mt-1 max-w-2xl leading-relaxed">
                    Daftarkan proyek Anda ke repositori nasional StyleUp SDGs. Dapatkan akses pendanaan dampak, jaringan relawan terampil, dan verifikasi standar ISO 14064 dari Bappenas.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 w-full lg:w-auto shrink-0">
                <button
                  onClick={() => onNavigate('pembayaran')}
                  className="flex-1 lg:flex-initial py-2.5 px-5 rounded-xl bg-[#0d503c] hover:bg-[#003828] text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <span className="material-symbols-outlined text-base">rocket_launch</span>
                  <span>Daftarkan Proyek Sekarang</span>
                </button>
                <button
                  onClick={() => onNavigate('pemetaan')}
                  className="py-2.5 px-4 rounded-xl bg-white text-[#0b1c30] hover:bg-[#f0f4f9] border border-[#e5eeff] text-xs font-semibold transition-colors flex items-center justify-center whitespace-nowrap"
                >
                  Panduan Kurasi
                </button>
              </div>
            </section>

          </section>
        </div>

      </div>
    </main>
  );
}
