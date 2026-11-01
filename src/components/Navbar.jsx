import { useState } from 'react';
import { LOGO_URL, AVATAR_URL } from '../data';

const PRIMARY_NAV_ITEMS = [
  { path: 'beranda', label: 'Beranda', icon: 'home' },
  { path: 'pemetaan', label: 'Pemetaan SDGs', icon: 'public' },
  { path: 'eksplorasi', label: 'Eksplorasi Proyek', icon: 'travel_explore' },
  { path: 'pembayaran', label: 'Donasi & Dana', icon: 'payments' },
];

export default function Navbar({
  currentPage,
  onNavigate,
  onOpenCreateProject,
  currentUser = null,
  unreadNotificationsCount = 0,
  onLogout = () => {},
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#e5e9eb] w-full h-[68px] flex items-center shadow-xs">
      <div className="w-full max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 h-full flex items-center justify-between gap-3">
        
        {/* 1. BRAND LOGO (Logo Asli Resmi StyleUp Sustainability) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('beranda')}
            className="flex items-center cursor-pointer text-left focus:outline-none group select-none py-1"
            title="StyleUp Sustainability - Beranda"
          >
            <img
              src={LOGO_URL}
              alt="StyleUp Sustainability"
              className="h-[40px] sm:h-[44px] w-auto object-contain group-hover:scale-102 transition-transform"
            />
          </button>
        </div>

        {/* 2 & 3. RIGHT SECTION: Navigation Pill Bar + Action Controls (Digeser ke kanan, dekat dengan Buat Proyek) */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 ml-auto shrink-0">
          
          {/* Navigation Pill Bar */}
          <nav className="hidden xl:flex items-center bg-[#f1f5f2] p-1 rounded-full border border-[#e2e8e4] gap-0.5">
            {PRIMARY_NAV_ITEMS.map((item) => {
              const isActive = currentPage === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => onNavigate(item.path)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[13px] font-semibold transition-all duration-150 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-[#00513b] text-white font-bold shadow-xs'
                      : 'text-[#475569] hover:text-[#00513b] hover:bg-white/70'
                  }`}
                >
                  <span className={`material-symbols-outlined text-[17px] ${isActive ? 'text-[#6cf8bb]' : 'text-[#64748b]'}`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Action Button: Green Pill "+ Buat Proyek" */}
          <button
            onClick={() => onOpenCreateProject ? onOpenCreateProject() : onNavigate('eksplorasi')}
            className="hidden sm:flex items-center gap-1.5 bg-[#00513b] hover:bg-[#003828] text-white text-[13px] font-bold py-1.5 px-4 rounded-full shadow-xs hover:shadow-md transition-all whitespace-nowrap cursor-pointer active:scale-95 border border-[#6cf8bb]/30"
          >
            <span className="material-symbols-outlined text-[17px]">add</span>
            <span>Buat Proyek</span>
          </button>

          {/* Notification Button (Bulat dengan titik notifikasi merah) */}
          <button
            onClick={() => onNavigate('notifikasi')}
            title={unreadNotificationsCount > 0 ? `Notifikasi (${unreadNotificationsCount} Baru)` : "Pusat Notifikasi"}
            className={`relative w-9 h-9 rounded-full bg-white hover:bg-[#f1f5f9] border border-[#e2e8f0] flex items-center justify-center transition-all cursor-pointer shrink-0 ${
              currentPage === 'notifikasi' ? 'ring-2 ring-[#00513b] text-[#00513b]' : 'text-[#475569]'
            }`}
          >
            <span className="material-symbols-outlined text-[19px]">notifications</span>
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#ba1a1a] rounded-full ring-2 ring-white animate-pulse" />
            )}
          </button>

          {/* User Profile Pill or Guest Controls */}
          {currentUser ? (
            <div className="relative">
              <div
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-[#e2e8f0] bg-white hover:border-[#cbd5e1] hover:bg-[#f8fafc] cursor-pointer transition-all select-none shadow-2xs"
              >
                <div className="relative shrink-0">
                  <img
                    src={currentUser.avatar || AVATAR_URL}
                    alt={currentUser.name}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-1 ring-[#cbd5e1]"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#006c49] text-white text-[8px] font-bold flex items-center justify-center ring-1.5 ring-white">
                    ✓
                  </span>
                </div>
                
                <div className="hidden md:flex flex-col text-left justify-center min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[12px] font-bold text-[#0f172a] leading-tight truncate">
                      {currentUser.name ? currentUser.name.split(' ')[0] : 'Najlaa'}
                    </span>
                    <span className="px-1.5 py-0.2 rounded-md bg-[#fef3c7] text-[#92400e] text-[9.5px] font-extrabold flex items-center gap-0.5 border border-[#fde68a]">
                      ★ {currentUser.esgScore || 850} pt
                    </span>
                  </div>
                  <span className="text-[10px] text-[#64748b] leading-tight truncate">
                    {currentUser.role || 'Relawan Bappenas'}
                  </span>
                </div>
              </div>

              {/* Profile Dropdown Menu */}
              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#e5eeff] py-2 z-50 animate-fade-in">
                  <div className="px-4 py-3 border-b border-[#eff4ff] bg-[#f8f9ff] rounded-t-2xl">
                    <div className="text-xs font-bold text-[#0b1c30]">{currentUser.name}</div>
                    <div className="text-[11px] text-[#707974] truncate">{currentUser.email || 'najlaa@esg-investama.id'}</div>
                    <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-[#6cf8bb]/40 text-[#00513b] text-[10px] font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00513b]" />
                      Relawan Nasional Terverifikasi
                    </span>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => { onNavigate('profil'); setProfileOpen(false); }}
                      className="w-full px-4 py-2.5 text-left text-xs text-[#0b1c30] hover:bg-[#eff4ff] flex items-center gap-2.5 font-medium cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px] text-[#006c49]">account_circle</span>
                      <span>Profil &amp; Portofolio Saya</span>
                    </button>
                    <button
                      onClick={() => { onNavigate('sertifikasi'); setProfileOpen(false); }}
                      className="w-full px-4 py-2.5 text-left text-xs text-[#0b1c30] hover:bg-[#eff4ff] flex items-center gap-2.5 font-medium cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px] text-[#006c49]">workspace_premium</span>
                      <span>Sertifikat &amp; Brevet Relawan</span>
                    </button>
                    <button
                      onClick={() => { onNavigate('riwayat-pembayaran'); setProfileOpen(false); }}
                      className="w-full px-4 py-2.5 text-left text-xs text-[#0b1c30] hover:bg-[#eff4ff] flex items-center gap-2.5 font-medium cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px] text-[#006c49]">receipt_long</span>
                      <span>Riwayat Donasi &amp; Pajak</span>
                    </button>
                  </div>

                  <div className="border-t border-[#eff4ff] pt-1">
                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        onLogout();
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-[#ba1a1a] hover:bg-[#ffdad6]/40 flex items-center gap-2.5 font-semibold cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">logout</span>
                      <span>Keluar Akun</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onNavigate('login')}
                className="px-3 py-1.5 rounded-full text-xs font-bold text-[#003828] bg-[#eff4ff] hover:bg-[#e0e9f8] transition-all flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]">login</span>
                <span>Masuk</span>
              </button>
              <button
                onClick={() => onNavigate('register')}
                className="hidden sm:flex px-3 py-1.5 rounded-full text-xs font-bold text-white bg-[#00513b] hover:bg-[#003828] transition-all items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]">person_add</span>
                <span>Daftar</span>
              </button>
            </div>
          )}



          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="xl:hidden p-2 rounded-full bg-[#f1f5f2] hover:bg-[#e2e8e4] text-[#0b1c30] cursor-pointer"
            aria-label="Buka Menu Navigasi"
          >
            <span className="material-symbols-outlined text-xl">{mobileOpen ? 'close' : 'menu'}</span>
          </button>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div className="xl:hidden bg-white border-t border-[#e5eeff] px-4 py-3 flex flex-col gap-1 shadow-lg animate-fade-in absolute top-full left-0 right-0 z-50">
          {PRIMARY_NAV_ITEMS.map((item) => (
            <button
              key={item.path}
              onClick={() => { onNavigate(item.path); setMobileOpen(false); }}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all text-left cursor-pointer ${
                currentPage === item.path
                  ? 'bg-[#00513b] text-white font-bold'
                  : 'text-[#404944] hover:bg-[#eff4ff] hover:text-[#003828]'
              }`}
            >
              <span className="material-symbols-outlined text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}

          {currentUser ? (
            <button
              onClick={() => { onNavigate('profil'); setMobileOpen(false); }}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all text-left cursor-pointer ${
                currentPage === 'profil'
                  ? 'bg-[#00513b] text-white font-bold'
                  : 'text-[#404944] hover:bg-[#eff4ff] hover:text-[#003828]'
              }`}
            >
              <span className="material-symbols-outlined text-lg">account_circle</span>
              <span>Profil Saya ({currentUser.name})</span>
            </button>
          ) : (
            <button
              onClick={() => { onNavigate('login'); setMobileOpen(false); }}
              className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-[#003828] bg-[#eff4ff] hover:bg-[#e0e9f8] transition-all text-left cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">login</span>
              <span>Masuk ke Akun</span>
            </button>
          )}
          
          <div className="pt-2 mt-1 border-t border-[#eff4ff] flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileOpen(false);
                if (onOpenCreateProject) onOpenCreateProject();
                else onNavigate('eksplorasi');
              }}
              className="w-full py-2.5 bg-[#00513b] hover:bg-[#003828] text-white rounded-full text-xs font-bold text-center flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              <span>Buat Proyek Baru</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
