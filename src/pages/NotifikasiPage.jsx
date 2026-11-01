import { useState } from 'react';

export default function NotifikasiPage({
  onNavigate,
  currentUser,
  notifications = [],
  onMarkAllRead,
  onToggleRead,
  onDeleteNotification,
  onClearAll,
}) {
  const [filter, setFilter] = useState('all');

  // Guard: Guest Mode
  if (!currentUser) {
    return (
      <main className="flex-1 w-full bg-[#f8f9ff] py-12 px-4 flex items-center justify-center">
        <div className="max-w-[560px] w-full bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-[#e5eeff] text-center flex flex-col items-center animate-slide-up">
          <div className="w-16 h-16 rounded-2xl bg-[#eff4ff] text-[#006c49] flex items-center justify-center mb-4 ring-8 ring-[#eff4ff]/60">
            <span className="material-symbols-outlined text-3xl">notifications_paused</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0b1c30] mb-2">
            Pusat Notifikasi Terkunci
          </h2>
          <p className="text-xs sm:text-sm text-[#404944] leading-relaxed mb-6">
            Anda sedang menjelajahi website sebagai <strong>Tamu Tanpa Akun</strong>. Silakan masuk ke akun Anda untuk melihat status verifikasi donasi, konfirmasi e-sertifikat ISO 14064, dan panggilan kerelawanan lapangan secara real-time.
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
      </main>
    );
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  const filtered = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'read') return n.read;
    return true;
  });

  return (
    <main className="flex-1 w-full bg-[#f8f9ff]">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">

        {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-xs text-[#404944]">
            <button onClick={() => onNavigate('beranda')} className="hover:text-[#003828] transition-colors cursor-pointer">
              Beranda
            </button>
            <span className="material-symbols-outlined text-sm text-[#707974]">chevron_right</span>
            <span className="font-bold text-[#006c49]">Pusat Notifikasi &amp; Log Aktivitas</span>
          </div>

          <div className="flex items-center gap-3">
            {unreadCount > 0 && onMarkAllRead && (
              <button
                onClick={onMarkAllRead}
                className="text-xs text-[#006c49] hover:underline font-bold flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">done_all</span>
                Tandai semua sudah dibaca
              </button>
            )}
            {notifications.length > 0 && onClearAll && (
              <button
                onClick={() => {
                  if (window.confirm('Bersihkan semua notifikasi?')) {
                    onClearAll();
                  }
                }}
                className="text-xs text-[#707974] hover:text-[#ba1a1a] font-medium flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-sm">delete_sweep</span>
                Bersihkan
              </button>
            )}
          </div>
        </div>

        {/* Header Title & Filter Tabs */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm border border-[#e5eeff] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#0b1c30]">Notifikasi Saya</h1>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-[#ba1a1a] text-white text-[11px] font-bold animate-pulse">
                  {unreadCount} baru
                </span>
              )}
            </div>
            <p className="text-xs text-[#404944] mt-1">
              Pembaruan status verifikasi donasi, konfirmasi sertifikat ISO 14064, dan log aktivitas akun Anda.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto bg-[#f8f9ff] p-1 rounded-xl border border-[#e5eeff]">
            {[
              { id: 'all', label: `Semua (${notifications.length})` },
              { id: 'unread', label: `Belum Dibaca (${unreadCount})` },
              { id: 'read', label: `Sudah Dibaca` },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  filter === tab.id
                    ? 'bg-[#0d503c] text-white shadow-xs'
                    : 'text-[#404944] hover:text-[#003828] hover:bg-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl sm:rounded-3xl p-12 text-center text-[#707974] shadow-sm border border-[#e5eeff]">
              <div className="w-16 h-16 rounded-full bg-[#eff4ff] text-[#707974] flex items-center justify-center mx-auto mb-3">
                <span className="material-symbols-outlined text-3xl">notifications_off</span>
              </div>
              <h4 className="text-sm font-bold text-[#0b1c30] mb-1">Tidak Ada Notifikasi</h4>
              <p className="text-xs text-[#707974] max-w-sm mx-auto">
                {filter === 'unread'
                  ? 'Semua notifikasi telah dibaca. Aktivitas baru akan muncul di sini secara real-time.'
                  : 'Belum ada notifikasi dalam filter ini.'}
              </p>
            </div>
          ) : (
            filtered.map(n => (
              <div
                key={n.id}
                onClick={() => onToggleRead && onToggleRead(n.id)}
                className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 relative group ${
                  !n.read
                    ? 'bg-white border-[#006c49]/40 shadow-sm ring-1 ring-[#006c49]/20'
                    : 'bg-white/70 border-[#e5eeff] hover:bg-white hover:border-[#ccd9eb]'
                }`}
              >
                {/* Status Dot */}
                {!n.read && (
                  <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-[#006c49] ring-4 ring-[#6cf8bb]/30" />
                )}

                {/* Icon Badge */}
                <div
                  className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${
                    n.type === 'success'
                      ? 'bg-[#6cf8bb]/30 text-[#006c49]'
                      : n.type === 'warning'
                      ? 'bg-[#ffdad6] text-[#ba1a1a]'
                      : 'bg-[#eff4ff] text-[#003828]'
                  }`}
                >
                  <span className="material-symbols-outlined text-xl sm:text-2xl">
                    {n.icon || 'notifications'}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className={`text-sm ${!n.read ? 'font-extrabold text-[#0b1c30]' : 'font-semibold text-[#404944]'}`}>
                      {n.title}
                    </h3>
                    <span className="text-[11px] text-[#707974] shrink-0 font-medium">
                      {n.time}
                    </span>
                  </div>

                  <p className="text-xs text-[#404944] leading-relaxed mb-3">
                    {n.message}
                  </p>

                  <div className="flex items-center gap-3 flex-wrap">
                    {n.link && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate(n.link);
                        }}
                        className="text-xs font-bold text-[#006c49] hover:underline flex items-center gap-1 cursor-pointer bg-[#eff4ff] hover:bg-[#e0e9f8] px-2.5 py-1 rounded-lg transition-colors"
                      >
                        <span>{n.linkText || 'Buka Halaman'}</span>
                        <span className="material-symbols-outlined text-xs">arrow_forward</span>
                      </button>
                    )}

                    <span className="text-[10px] text-[#707974] select-none">
                      {!n.read ? 'Klik kartu untuk tandai dibaca' : 'Klik kartu untuk tandai belum dibaca'}
                    </span>

                    {onDeleteNotification && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteNotification(n.id);
                        }}
                        className="text-[11px] text-[#ba1a1a] hover:underline ml-auto flex items-center gap-0.5 cursor-pointer opacity-70 group-hover:opacity-100 transition-opacity"
                        title="Hapus notifikasi"
                      >
                        <span className="material-symbols-outlined text-xs">delete</span>
                        <span>Hapus</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </main>
  );
}
