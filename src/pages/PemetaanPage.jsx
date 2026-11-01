import { useState } from 'react';

const REGIONS = {
  kalimantan: {
    hudTitle: 'Fokus Pantauan: Kalimantan Tengah',
    aqi: '284 (Sangat Berbahaya)',
    ndvi: '0.21 (Kritis)',
    coords: '-2.2096° S, 113.9189° E',
    pillTitle: 'Hotspot Karhutla Aktif: Kalimantan & Sumatera',
    pillCount: '184 Titik Api Kritis',
    zoneTag: 'ZONA TANGGAP DARURAT',
    province: 'Provinsi Kalimantan Tengah',
    desc: 'Pusat koordinasi komando pemadaman karhutla lahan gambut, evakuasi warga rentan terdampak asap, dan penggelaran sumur bor darurat di Palangka Raya & Pulang Pisau.',
    status: 'Siaga Darurat',
    team: '48 Regu Gabungan',
    card1Title: 'Penanganan Darurat Karhutla & Distribusi Oksigen/Masker N95 Palangka Raya',
    card1Tag: 'SDG 13 Iklim & SDG 3',
    card1TagBg: 'bg-[#3F7E44]',
    card1Desc: 'Penyediaan 15 shelter oksigen gratis, evakuasi kelompok rentan ISPA, serta distribusi 50.000 masker N95 di kantong asap terparah Kalteng.',
    card1MetricLabel: 'Realisasi Tanggap Cepat',
    card1MetricVal: 'Rp 680.000.000',
    card1Target: '/ Rp 750jt',
    card1Img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDT08DFxYuns4iESaAvwMsS7sVYn62t49eBqQdVaxXdRFUMsbBZVaKHsx0hc-U-l8hNdwxFbB3FdxU3pBudY2LtMILZPZTSqSxWgdTvYNJwWs6U_0C94T9BI1nsQydIcA5XRl14Q-QcgbCG6j3RH23PHvSwCEQ88Bi56HOjNvWkvYR-rKAnaLdX9iLfAzMwe9wGIvIw8y18uQmayfCgrG23x6pSl678lZ7MT980EH13qPNlY9x4BMiQcCP46ifKKyu9Mg',
    card2Title: 'Restorasi Sekat Kanal Gambut & Konservasi Hutan Lindung Sebangau',
    card2Tag: 'SDG 15 Ekosistem Darat',
    card2TagBg: 'bg-[#56C02B]',
    card2Desc: 'Pembasahan kembali (rewetting) 1.200 hektar gambut dan pembangunan 65 sekat kanal guna memutus rambatan api bawah tanah.',
    card2MetricLabel: 'Penerima Dampak',
    card2MetricVal: '12.500 Warga & Satwa Dilindungi',
    card2Img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAba2m11tkiG4DXCWahZpuUDbuU2SyMSTJQlpbgncJ1pn4wO2Mia4znws_3o1VgORAdPJVWdGQ0DhfwXtGdCor_6CHgNwCLnF3XL8aS50ROu6uxPG71F0j0qotcXGW2EGBvFxWKhhhF_HUWlnZOMjikSRy3BVnh0z7w7oE_noXgjjK6qcJye4wP6GecWEVsfX-rgMvpTPux1h6KMdNj_vdMc8EXK4LSvWXUB2lkpTBI29phBbIHtphE',
  },
  sumatera: {
    hudTitle: 'Fokus Pantauan: Riau & Sumsel',
    aqi: '195 (Tidak Sehat)',
    ndvi: '0.38 (Waspada)',
    coords: '-0.5333° S, 101.4500° E',
    pillTitle: 'Wilayah Pantauan Asap Gambut: Riau',
    pillCount: '76 Titik Api Waspada',
    zoneTag: 'ZONA RESTORASI GAMBUT',
    province: 'Provinsi Riau / Sumatera Selatan',
    desc: 'Restorasi hidrologis gambut, pemantauan patroli udara sekat kanal, dan mitigasi asap kabut lintas perbatasan Sumatera.',
    status: 'Siaga 2 Waspada',
    team: '32 Regu Manggala Agni',
    card1Title: 'Restorasi Hidrologis Kubah Gambut Giam Siak Kecil',
    card1Tag: 'SDG 15 Ekosistem Darat',
    card1TagBg: 'bg-[#56C02B]',
    card1Desc: 'Pengembalian muka air gambut melalui 40 sumur pantau otomatis dan reboisasi bibit pohon endemik rawa.',
    card1MetricLabel: 'Realisasi Restorasi',
    card1MetricVal: 'Rp 520.000.000',
    card1Target: '/ Rp 600jt',
    card1Img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAba2m11tkiG4DXCWahZpuUDbuU2SyMSTJQlpbgncJ1pn4wO2Mia4znws_3o1VgORAdPJVWdGQ0DhfwXtGdCor_6CHgNwCLnF3XL8aS50ROu6uxPG71F0j0qotcXGW2EGBvFxWKhhhF_HUWlnZOMjikSRy3BVnh0z7w7oE_noXgjjK6qcJye4wP6GecWEVsfX-rgMvpTPux1h6KMdNj_vdMc8EXK4LSvWXUB2lkpTBI29phBbIHtphE',
    card2Title: 'Mitigasi Kabut Asap & Posko Siaga Puskesmas Tualang',
    card2Tag: 'SDG 3 Sehat Sejahtera',
    card2TagBg: 'bg-[#4C9F38]',
    card2Desc: 'Pengadaan nebulizer terpadu dan pembagian tabung oksigen portabel untuk balita dan lansia wilayah gambut terdampak.',
    card2MetricLabel: 'Penerima Manfaat',
    card2MetricVal: '8.400 Warga Komunitas',
    card2Img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDT08DFxYuns4iESaAvwMsS7sVYn62t49eBqQdVaxXdRFUMsbBZVaKHsx0hc-U-l8hNdwxFbB3FdxU3pBudY2LtMILZPZTSqSxWgdTvYNJwWs6U_0C94T9BI1nsQydIcA5XRl14Q-QcgbCG6j3RH23PHvSwCEQ88Bi56HOjNvWkvYR-rKAnaLdX9iLfAzMwe9wGIvIw8y18uQmayfCgrG23x6pSl678lZ7MT980EH13qPNlY9x4BMiQcCP46ifKKyu9Mg',
  },
  jawa: {
    hudTitle: 'Fokus Pantauan: Jawa Tengah',
    aqi: '68 (Sedang)',
    ndvi: '0.72 (Sangat Baik)',
    coords: '-7.1509° S, 110.1402° E',
    pillTitle: 'Wilayah Kolaborasi Aktif: DAS Solo & Progo',
    pillCount: '42 Proyek Mandiri',
    zoneTag: 'ZONA AKTIF KOLABORATIF',
    province: 'Provinsi Jawa Tengah',
    desc: 'Akselerasi sanitasi mandiri, sumur gravitasi pedesaan di lereng pegunungan, serta pembinaan pemuda penggerak desa lestari.',
    status: 'Kolaboratif Berjalan',
    team: '95 Komunitas Desa',
    card1Title: 'Pembangunan Sumur Gravitasi & Filter Air Bersih Wonosobo',
    card1Tag: 'SDG 6 Air Bersih',
    card1TagBg: 'bg-[#26BDE2]',
    card1Desc: 'Pengaliran air bersih gravitasi 12 km untuk 3 desa terpencil tanpa emisi listrik dan filter bio-pasir alami.',
    card1MetricLabel: 'Dana Terhimpun',
    card1MetricVal: 'Rp 390.000.000',
    card1Target: '/ Rp 400jt',
    card1Img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDT08DFxYuns4iESaAvwMsS7sVYn62t49eBqQdVaxXdRFUMsbBZVaKHsx0hc-U-l8hNdwxFbB3FdxU3pBudY2LtMILZPZTSqSxWgdTvYNJwWs6U_0C94T9BI1nsQydIcA5XRl14Q-QcgbCG6j3RH23PHvSwCEQ88Bi56HOjNvWkvYR-rKAnaLdX9iLfAzMwe9wGIvIw8y18uQmayfCgrG23x6pSl678lZ7MT980EH13qPNlY9x4BMiQcCP46ifKKyu9Mg',
    card2Title: 'Pusat Literasi Iklim & Bank Sampah Digital Banyumas',
    card2Tag: 'SDG 4 & SDG 12',
    card2TagBg: 'bg-[#C5192D]',
    card2Desc: 'Pendampingan 2.400 siswa dan ibu rumah tangga dalam pengelolaan sampah bernilai ekonomi sirkular.',
    card2MetricLabel: 'Penerima Manfaat',
    card2MetricVal: '14.200 Jiwa Terlayani',
    card2Img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAba2m11tkiG4DXCWahZpuUDbuU2SyMSTJQlpbgncJ1pn4wO2Mia4znws_3o1VgORAdPJVWdGQ0DhfwXtGdCor_6CHgNwCLnF3XL8aS50ROu6uxPG71F0j0qotcXGW2EGBvFxWKhhhF_HUWlnZOMjikSRy3BVnh0z7w7oE_noXgjjK6qcJye4wP6GecWEVsfX-rgMvpTPux1h6KMdNj_vdMc8EXK4LSvWXUB2lkpTBI29phBbIHtphE',
  },
  sulawesi: {
    hudTitle: 'Fokus Pantauan: Sulawesi Tenggara & Tengah',
    aqi: '42 (Baik)',
    ndvi: '0.65 (Stabil)',
    coords: '-4.0000° S, 122.5000° E',
    pillTitle: 'Wilayah Konservasi Pesisir: Wakatobi',
    pillCount: '19 Klaster Bahari',
    zoneTag: 'ZONA KONSERVASI BAHARI',
    province: 'Provinsi Sulawesi Tenggara',
    desc: 'Perlindungan terumbu karang melalui struktur Biorock terintegrasi tenaga surya dan penguatan wilayah kelola nelayan tradisional.',
    status: 'Konservasi Aktif',
    team: '28 Tim Ranger Bahari',
    card1Title: 'Restorasi Terumbu Karang Biorock Wakatobi',
    card1Tag: 'SDG 14 Ekosistem Laut',
    card1TagBg: 'bg-[#0A97D9]',
    card1Desc: 'Transplantasi 5.000 fragmen karang dengan akselerasi mineral akresi menggunakan energi panel surya terapung.',
    card1MetricLabel: 'Dana Konservasi',
    card1MetricVal: 'Rp 840.000.000',
    card1Target: '/ Rp 900jt',
    card1Img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtCZULvRzyTBAiYBko_70IPb6kqxBrTVwojZ0o6_IgWhRA3DeTS5jGKKKuA8BbbpnSDG_fAMwbGv9pIX3EbF9rrQ8rl94kPJNmAAT3M8bgZ_R1f7Lx3LLePjtlK78i3RhEHDBABkngWpHVthm-U3I9PI9BXZ-u-ToXCwyFgDNl4esZfBgGXl0Ygw-RI_068sQe5HTzrnKHvuuhUx-amEOqrbTPgenmdWmAqp_DRmBewmg1TpjYJcvP',
    card2Title: 'Sanitasi Pesisir Pulau Hoga & Pengolahan Air Payau',
    card2Tag: 'SDG 6 Air Bersih',
    card2TagBg: 'bg-[#26BDE2]',
    card2Desc: 'Instalasi desalinasi bertenaga surya skala mikro bagi 450 keluarga nelayan suku Bajo di pulau terluar.',
    card2MetricLabel: 'Penerima Dampak',
    card2MetricVal: '2.100 Jiwa Pesisir',
    card2Img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDT08DFxYuns4iESaAvwMsS7sVYn62t49eBqQdVaxXdRFUMsbBZVaKHsx0hc-U-l8hNdwxFbB3FdxU3pBudY2LtMILZPZTSqSxWgdTvYNJwWs6U_0C94T9BI1nsQydIcA5XRl14Q-QcgbCG6j3RH23PHvSwCEQ88Bi56HOjNvWkvYR-rKAnaLdX9iLfAzMwe9wGIvIw8y18uQmayfCgrG23x6pSl678lZ7MT980EH13qPNlY9x4BMiQcCP46ifKKyu9Mg',
  },
};

export default function PemetaanPage({ onNavigate, onDonate, onOpenCreateProject }) {
  const [activeRegionKey, setActiveRegionKey] = useState('kalimantan');
  const [selectedProvinceName, setSelectedProvinceName] = useState('Kalimantan Tengah');

  const cur = REGIONS[activeRegionKey] || REGIONS.kalimantan;

  return (
    <div className="w-full bg-[#f8f9ff] py-6 sm:py-8">
      <div className="max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 flex flex-col gap-6 sm:gap-8">

        {/* Top Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-[#404944]">
            <button onClick={() => onNavigate('beranda')} className="hover:text-[#003828] cursor-pointer transition-colors">Beranda</button>
            <span className="material-symbols-outlined text-sm text-[#707974]">chevron_right</span>
            <span className="font-bold text-[#006c49]">Radar Lapangan &amp; Pemetaan Geospasial SDGs</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6cf8bb]/50 text-[#00714d] text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#006c49] animate-pulse" /> Sentinel-2 Data Real-time
            </span>
          </div>
        </div>

        {/* Main GIS Map Workspace & Detail Panel Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* Interactive Map Stage (Span 8) */}
          <div className="lg:col-span-8 flex flex-col gap-5">
            {/* Map Canvas Card */}
            <div className="relative w-full rounded-2xl bg-[#003828] overflow-hidden shadow-md min-h-[500px] sm:min-h-[580px] flex flex-col justify-between border border-[#e5eeff]">
              
              {/* Map Image Base */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDCDYjnLI2zVS5AxvIE7-4S1zOQxhsZAnyRah6JhLOmXZflVWeZu3-Oj75Sbex_EfUBu41OgOw-4M5dlhdZizjVAJHEFqCME1wy03p1v6dSUw9Z-VznG_csgV3hwIWDPB7ir0VMH2jrALnaQnZLQGdBapasrTT67mRTIUvhMa2wpsHl7aCcG1OyWws-LD-h42QjFZEexrN9TdV9rlXpue_3LLpaCn35Bt7Mhiq4bvC5Xzc03n_YztP9f_cDiAlDut5lwA"
                  alt="Peta Indonesia Geospasial"
                  className="w-full h-full object-cover filter contrast-[1.05] brightness-95 opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#003828]/70 via-transparent to-[#003828]/30 pointer-events-none" />
              </div>

              {/* Top HUD Bar */}
              <div className="relative z-10 p-4 flex flex-col gap-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-sm border border-[#e5eeff] text-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ba1a1a] animate-ping" />
                    <span className="font-semibold text-[#0b1c30]">{cur.pillTitle}</span>
                    <span className="text-[#707974]">•</span>
                    <span className="text-[#ba1a1a] font-bold">{cur.pillCount}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 bg-[#0d503c] text-white px-3 py-1 rounded-full shadow text-xs font-bold border border-[#6cf8bb]/40">
                      <span className="material-symbols-outlined text-sm text-[#6cf8bb]">satellite_alt</span>
                      <span>Live Sentinel-2</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#6cf8bb] animate-pulse" />
                    </div>
                  </div>
                </div>

                {/* Sub HUD Metrics */}
                <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs text-[#0b1c30] border border-[#e5eeff] shadow-sm flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#ba1a1a] animate-ping" />
                    <span className="text-[#707974] uppercase text-[10px] font-semibold">{cur.hudTitle.split(':')[0]}:</span>
                    <span className="font-bold text-[#0b1c30]">{cur.province}</span>
                  </div>
                  <span className="text-[#bfc9c2]">|</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#707974] text-[10px]">AQI:</span>
                    <strong className="text-[#ba1a1a] font-bold">{cur.aqi}</strong>
                  </div>
                  <span className="text-[#bfc9c2]">|</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#707974] text-[10px]">NDVI:</span>
                    <strong className="text-[#006c49] font-bold">{cur.ndvi}</strong>
                  </div>
                  <span className="text-[#bfc9c2] hidden md:inline">|</span>
                  <span className="font-mono text-[#707974] text-[11px] hidden md:inline">{cur.coords}</span>
                </div>
              </div>

              {/* Map Interactive Hotspots */}
              <div className="relative z-10 px-4 py-8 min-h-[300px]">
                {/* Sumatera */}
                <div
                  onClick={() => setActiveRegionKey('sumatera')}
                  className="absolute left-[16%] top-[38%] cursor-pointer group z-20"
                >
                  <div className="relative flex items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-7 w-7 rounded-full bg-[#DDA63A] opacity-75" />
                    <span className="relative inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#DDA63A] text-white text-xs font-bold shadow-md ring-2 ring-white hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-sm">forest</span>
                    </span>
                  </div>
                  <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded shadow text-[10px] font-bold text-[#0b1c30] whitespace-nowrap border border-[#e5eeff]">
                    Riau / Sumsel (SDG 15)
                  </div>
                </div>

                {/* Kalimantan Tengah */}
                <div
                  onClick={() => setActiveRegionKey('kalimantan')}
                  className="absolute left-[47%] top-[28%] cursor-pointer group z-20"
                >
                  <div className="relative flex items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-9 w-9 rounded-full bg-[#ba1a1a] opacity-75" />
                    <span className="relative inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#ba1a1a] text-white text-xs font-bold shadow-md ring-2 ring-white hover:scale-110 transition-transform animate-pulse">
                      <span className="material-symbols-outlined text-sm">local_fire_department</span>
                    </span>
                  </div>
                  <div className="absolute top-9 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded shadow text-[10px] font-bold text-[#ba1a1a] whitespace-nowrap border border-[#ba1a1a]/30 ring-1 ring-[#ba1a1a]/20">
                    Kalimantan Tengah (Siaga 1)
                  </div>
                </div>

                {/* Jawa Tengah */}
                <div
                  onClick={() => setActiveRegionKey('jawa')}
                  className="absolute left-[36%] top-[72%] cursor-pointer group z-20"
                >
                  <div className="relative flex items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-[#26BDE2] opacity-75" />
                    <span className="relative inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#26BDE2] text-white text-xs font-bold shadow-md ring-2 ring-white hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-sm">water_drop</span>
                    </span>
                  </div>
                  <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded shadow text-[10px] font-bold text-[#0b1c30] whitespace-nowrap border border-[#e5eeff]">
                    Jawa Tengah (SDG 6 &amp; 4)
                  </div>
                </div>

                {/* Sulawesi / Wakatobi */}
                <div
                  onClick={() => setActiveRegionKey('sulawesi')}
                  className="absolute left-[68%] top-[45%] cursor-pointer group z-20"
                >
                  <div className="relative flex items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-7 w-7 rounded-full bg-[#0A97D9] opacity-75" />
                    <span className="relative inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#0A97D9] text-white text-xs font-bold shadow-md ring-2 ring-white hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-sm">waves</span>
                    </span>
                  </div>
                  <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded shadow text-[10px] font-bold text-[#0b1c30] whitespace-nowrap border border-[#e5eeff]">
                    Wakatobi (SDG 14)
                  </div>
                </div>
              </div>

              {/* Bottom Density Bar */}
              <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-2 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-b-2xl text-[#0b1c30] border-t border-[#e5eeff] shadow-sm text-xs">
                <div className="flex items-center gap-3 font-medium flex-wrap">
                  <span className="text-[#707974] uppercase text-[10px] font-semibold">Densitas Program:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#003828]" />
                    <span className="text-[#404944] text-[11px]">&lt; 10 Klaster</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#006c49]" />
                    <span className="text-[#404944] text-[11px]">10 - 25 Klaster</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#6cf8bb] ring-1 ring-[#006c49]" />
                    <span className="text-[#404944] text-[11px]">&gt; 25 Klaster Prioritas</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[#707974] text-[11px]">
                  <span className="material-symbols-outlined text-sm text-[#006c49]">satellite</span>
                  <span>Resolusi Satelit: 10m Multi-Spektral • Live</span>
                </div>
              </div>
            </div>

            {/* Geographic Analytical Insights (3 Bottom KPI Cards as requested!) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Card 1 */}
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#e5eeff] flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-[#0b1c30]">Rasio Partisipasi Pemuda</span>
                  <span className="material-symbols-outlined text-[#006c49] text-xl">groups</span>
                </div>
                <div className="text-2xl font-bold text-[#003828]">64.8%</div>
                <p className="text-xs text-[#707974] mt-1 leading-relaxed">Generasi Z &amp; Milenial mendominasi koordinator lapangan di Jawa Tengah.</p>
              </div>

              {/* Card 2 */}
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#e5eeff] flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-[#0b1c30]">Pendanaan Tersalurkan</span>
                  <span className="material-symbols-outlined text-[#006c49] text-xl">payments</span>
                </div>
                <div className="text-2xl font-bold text-[#003828]">Rp 8.42 M</div>
                <p className="text-xs text-[#707974] mt-1 leading-relaxed">Didukung aliansi filantropi ESG dan APBD SDGs kolaboratif.</p>
              </div>

              {/* Card 3 */}
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#e5eeff] flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-[#0b1c30]">Indeks Keberlanjutan</span>
                  <span className="material-symbols-outlined text-[#006c49] text-xl">eco</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold text-[#003828]">88.4</div>
                  <span className="px-2 py-0.5 rounded bg-[#6cf8bb]/40 text-[#003828] text-[10px] font-bold">Level Sangat Baik</span>
                </div>
                <p className="text-xs text-[#707974] mt-1 leading-relaxed">Berdasarkan audit independen Badan Riset &amp; Inovasi Daerah.</p>
              </div>
            </div>

            {/* Matriks Capaian Target SDGs Regional & Telemetri IoT Lapangan (From user screenshot 1!) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Box 1: Matriks Capaian Target SDGs Regional */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e5eeff] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#006c49] text-xl">query_stats</span>
                      <h3 className="text-sm font-bold text-[#0b1c30]">Matriks Capaian Target SDGs Regional</h3>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-[#eff4ff] text-[#006c49] text-[10px] font-semibold">Sinkronisasi Live</span>
                  </div>

                  <div className="space-y-3">
                    {[
                      { label: 'SDG 13 – Aksi Penanganan Iklim & Karbon', pct: '74%', bar: 'bg-[#3F7E44]' },
                      { label: 'SDG 15 – Restorasi Lahan Gambut & Hutan', pct: '62%', bar: 'bg-[#56C02B]' },
                      { label: 'SDG 3 – Posko Kesehatan Paru & Darurat ISPA', pct: '88%', bar: 'bg-[#4C9F38]' },
                      { label: 'SDG 6 – Penjernihan Air & Sumur Bor Gambut', pct: '55%', bar: 'bg-[#26BDE2]' },
                      { label: 'SDG 4 – Edukasi & Mitigasi Bencana Pemuda', pct: '91%', bar: 'bg-[#C5192D]' },
                    ].map(m => (
                      <div key={m.label} className="space-y-1">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-[#0b1c30] font-medium flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${m.bar}`} />
                            {m.label}
                          </span>
                          <span className="font-bold text-[#0b1c30]">{m.pct}</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-[#eff4ff] overflow-hidden">
                          <div className={`h-full ${m.bar} rounded-full`} style={{ width: m.pct }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-[#eff4ff] flex items-center justify-between text-xs text-[#707974]">
                  <span className="flex items-center gap-1 text-[#006c49] font-medium">
                    <span className="material-symbols-outlined text-sm">verified</span>
                    Validasi Tim Verifikator Independen
                  </span>
                  <button onClick={() => onNavigate('eksplorasi')} className="text-[#006c49] font-bold hover:underline flex items-center gap-0.5 cursor-pointer">
                    Rincian 17 Target →
                  </button>
                </div>
              </div>

              {/* Box 2: Telemetri IoT Lapangan */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e5eeff] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#ba1a1a] text-xl">sensors</span>
                      <h3 className="text-sm font-bold text-[#0b1c30]">Telemetri IoT Lapangan</h3>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-[#ffdad6] text-[#ba1a1a] text-[10px] font-bold">Real-Time</span>
                  </div>

                  <div className="space-y-2.5">
                    <div className="p-2.5 rounded-xl bg-[#eff4ff]/60 border border-[#e5eeff] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#ba1a1a] text-lg">air</span>
                        <div>
                          <div className="text-[11px] text-[#707974]">Indeks Kualitas Udara (AQI)</div>
                          <div className="text-xs font-bold text-[#0b1c30]">Palangka Raya Barat</div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-[#ba1a1a] text-white text-[11px] font-bold">284 Kritis</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#eff4ff]/60 border border-[#e5eeff] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#006c49] text-lg">water_damage</span>
                        <div>
                          <div className="text-[11px] text-[#707974]">Kelembaban Gambut Dalam</div>
                          <div className="text-xs font-bold text-[#0b1c30]">Hutan Lindung Sebangau</div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-[#ffdad6] text-[#ba1a1a] text-[11px] font-bold">18% (Kering)</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#eff4ff]/60 border border-[#e5eeff] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#006c49] text-lg">satellite_alt</span>
                        <div>
                          <div className="text-[11px] text-[#707974]">Pembaruan Citra Sentinel-2</div>
                          <div className="text-xs font-bold text-[#0b1c30]">Overpass Terakhir</div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-[#6cf8bb]/50 text-[#003828] text-[11px] font-bold">8 mnt lalu</span>
                    </div>
                  </div>
                </div>

                {/* Hotspot Trend Mini Bar */}
                <div className="mt-4 pt-3 border-t border-[#eff4ff]">
                  <div className="flex justify-between items-center text-xs mb-2">
                    <span className="text-[#0b1c30] font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm text-[#006c49]">trending_up</span>
                      Tren Hotspot Karhutla (7 Hari)
                    </span>
                    <span className="text-[#ba1a1a] font-bold text-[11px]">+14% vs Mgg Lalu</span>
                  </div>
                  <div className="h-14 flex items-end justify-between gap-2 px-1">
                    {[
                      { d: 'Sen', h: '30%', c: 'bg-[#dce9ff]' },
                      { d: 'Sel', h: '45%', c: 'bg-[#dce9ff]' },
                      { d: 'Rab', h: '38%', c: 'bg-[#dce9ff]' },
                      { d: 'Kam', h: '60%', c: 'bg-[#dce9ff]' },
                      { d: 'Jum', h: '75%', c: 'bg-[#ffdad6]' },
                      { d: 'Sab', h: '85%', c: 'bg-[#ffdad6]' },
                      { d: 'Ini', h: '100%', c: 'bg-[#ba1a1a]' },
                    ].map(x => (
                      <div key={x.d} className="flex-1 flex flex-col items-center gap-1">
                        <div className={`w-full rounded-t ${x.c}`} style={{ height: x.h }} />
                        <span className="text-[9px] text-[#707974]">{x.d}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Right Province Detail Sidebar (Span 4) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            
            {/* Regional Scope Banner */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e5eeff]">
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-[#eff4ff]">
                <div>
                  <div className="text-[11px] text-[#ba1a1a] uppercase tracking-wider font-bold">{cur.zoneTag}</div>
                  <h2 className="text-lg font-bold text-[#0b1c30]">{cur.province}</h2>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#ffdad6] flex items-center justify-center text-[#ba1a1a]">
                  <span className="material-symbols-outlined text-xl">local_fire_department</span>
                </div>
              </div>

              <p className="text-xs text-[#707974] leading-relaxed mb-4">{cur.desc}</p>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 rounded-xl bg-[#eff4ff]/60 border border-[#e5eeff]">
                  <div className="text-[10px] text-[#707974]">Status Operasi</div>
                  <div className="text-sm font-bold text-[#ba1a1a]">{cur.status}</div>
                </div>
                <div className="p-3 rounded-xl bg-[#eff4ff]/60 border border-[#e5eeff]">
                  <div className="text-[10px] text-[#707974]">Relawan &amp; Satgas</div>
                  <div className="text-sm font-bold text-[#0b1c30]">{cur.team}</div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onDonate ? onDonate() : onNavigate('pembayaran')}
                  className="flex-1 py-2.5 rounded-xl bg-[#0d503c] hover:bg-[#003828] text-white text-xs font-bold transition-all shadow-sm cursor-pointer text-center"
                >
                  Salurkan Donasi
                </button>
                <button
                  onClick={() => onNavigate('eksplorasi')}
                  className="px-3 py-2.5 rounded-xl bg-[#eff4ff] hover:bg-[#e5eeff] text-[#003828] text-xs font-semibold transition-all cursor-pointer"
                >
                  Lihat Proyek
                </button>
              </div>
            </div>

            {/* Inisiatif Terverifikasi Cards (Screenshot 1!) */}
            <div className="flex items-center justify-between px-1">
              <h3 className="text-sm font-bold text-[#0b1c30]">Inisiatif Terverifikasi</h3>
              <button
                onClick={() => onNavigate('eksplorasi')}
                className="text-xs font-semibold text-[#006c49] hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                Lihat Semua (42)
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>

            {/* Project Card 1 */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#e5eeff] flex flex-col justify-between">
              <div>
                <div className="relative w-full h-36 rounded-xl overflow-hidden mb-3">
                  <img src={cur.card1Img} alt={cur.card1Title} className="w-full h-full object-cover" />
                  <span className={`absolute top-2 left-2 ${cur.card1TagBg} text-white px-2.5 py-0.5 rounded text-[10px] font-bold shadow-sm`}>
                    {cur.card1Tag}
                  </span>
                  <span className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-[#006c49] px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 shadow-sm">
                    <span className="material-symbols-outlined text-xs">verified</span> Terverifikasi
                  </span>
                </div>
                <h4 className="text-xs font-bold text-[#0b1c30] mb-1 line-clamp-2">{cur.card1Title}</h4>
                <p className="text-[11px] text-[#707974] line-clamp-2 leading-relaxed">{cur.card1Desc}</p>
              </div>

              <div className="mt-3 pt-3 border-t border-[#eff4ff] flex items-center justify-between text-xs">
                <div>
                  <div className="text-[10px] text-[#707974]">{cur.card1MetricLabel}</div>
                  <div className="font-bold text-[#0b1c30]">{cur.card1MetricVal} <span className="text-[#707974] text-[10px] font-normal">{cur.card1Target}</span></div>
                </div>
                <button
                  onClick={() => onNavigate('eksplorasi')}
                  className="px-3.5 py-1.5 rounded-lg bg-[#eff4ff] hover:bg-[#dce9ff] text-[#003828] text-xs font-semibold transition-colors cursor-pointer"
                >
                  Detail
                </button>
              </div>
            </div>

            {/* Project Card 2 */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#e5eeff] flex flex-col justify-between">
              <div>
                <div className="relative w-full h-36 rounded-xl overflow-hidden mb-3">
                  <img src={cur.card2Img} alt={cur.card2Title} className="w-full h-full object-cover" />
                  <span className={`absolute top-2 left-2 ${cur.card2TagBg} text-white px-2.5 py-0.5 rounded text-[10px] font-bold shadow-sm`}>
                    {cur.card2Tag}
                  </span>
                  <span className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-[#006c49] px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 shadow-sm">
                    <span className="material-symbols-outlined text-xs">verified</span> Terverifikasi
                  </span>
                </div>
                <h4 className="text-xs font-bold text-[#0b1c30] mb-1 line-clamp-2">{cur.card2Title}</h4>
                <p className="text-[11px] text-[#707974] line-clamp-2 leading-relaxed">{cur.card2Desc}</p>
              </div>

              <div className="mt-3 pt-3 border-t border-[#eff4ff] flex items-center justify-between text-xs">
                <div>
                  <div className="text-[10px] text-[#707974]">{cur.card2MetricLabel}</div>
                  <div className="font-bold text-[#0b1c30]">{cur.card2MetricVal}</div>
                </div>
                <button
                  onClick={() => onNavigate('eksplorasi')}
                  className="px-3.5 py-1.5 rounded-lg bg-[#eff4ff] hover:bg-[#dce9ff] text-[#003828] text-xs font-semibold transition-colors cursor-pointer"
                >
                  Detail
                </button>
              </div>
            </div>

            {/* Callout Banner: Submit New Initiative (From screenshot 1!) */}
            <div className="bg-gradient-to-br from-[#0d503c] to-[#00271b] text-white rounded-2xl p-5 shadow-md relative overflow-hidden">
              <div className="relative z-10">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#6cf8bb]/30 text-[#b1f0d4] text-[10px] font-bold mb-2">
                  <span className="material-symbols-outlined text-xs">add_location_alt</span>
                  Ajukan Gerakan
                </span>
                <h4 className="text-sm font-bold text-white">Ada proyek SDGs di daerah Anda?</h4>
                <p className="text-xs text-[#dce9ff]/80 mt-1 leading-relaxed">
                  Daftarkan inisiatif lokal Anda untuk mendapatkan verifikasi dampak nasional dan pendanaan dari konsorsium StyleUp.
                </p>
                <button
                  onClick={() => onOpenCreateProject ? onOpenCreateProject() : onNavigate('eksplorasi')}
                  className="mt-3 px-4 py-2 bg-[#6cf8bb] hover:bg-[#4edea3] text-[#003828] rounded-xl text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <span>Registrasi Titik Wilayah</span>
                  <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
                </button>
              </div>
              <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-white/5 rounded-full pointer-events-none" />
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
