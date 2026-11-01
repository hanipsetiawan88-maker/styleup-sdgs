import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CreateProjectModal from './components/CreateProjectModal';
import StatusKurasiModal from './components/StatusKurasiModal';
import BerandaPage from './pages/BerandaPage';
import PemetaanPage from './pages/PemetaanPage';
import EksplorasiPage from './pages/EksplorasiPage';
import PembayaranPage from './pages/PembayaranPage';
import RiwayatPembayaranPage from './pages/RiwayatPembayaranPage';
import SertifikasiPage from './pages/SertifikasiPage';
import NotifikasiPage from './pages/NotifikasiPage';
import ProfilPage from './pages/ProfilPage';
import DetailProyekPage from './pages/DetailProyekPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LupaPasswordPage from './pages/LupaPasswordPage';
import { PROJECTS, NOTIFICATIONS } from './data';

export default function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [selectedProject, setSelectedProject] = useState(PROJECTS[3]); // Wakatobi default
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // User Authentication State: null = Guest / Belum Login
  const [currentUser, setCurrentUser] = useState(null);

  // Auth Required Interceptor Modal State
  const [authModal, setAuthModal] = useState(null);

  // Pending & Submitted Proposals State with LocalStorage persistence
  const [submittedProposals, setSubmittedProposals] = useState(() => {
    try {
      const stored = localStorage.getItem('styleup_submitted_proposals');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return [
      {
        id: 9991,
        title: 'Inisiatif Aksi Keberlanjutan Komunitas Tapak',
        description: 'Program percepatan implementasi target SDGs di tingkat komunitas melalui partisipasi warga, audit geospasial real-time, dan insentif keberlanjutan terverifikasi.',
        location: 'Kutai, Kalimantan Timur',
        sdgs: [{ num: 13, label: 'SDG 13', color: '#3F7E44' }, { num: 14, label: 'SDG 14', color: '#0A97D9' }],
        status: 'pending',
        verified: 'Menunggu Persetujuan Admin',
        collected: 0,
        target: 250000000,
        percent: 0,
        volunteers: '0 / 50',
        daysLeft: 60,
        urgent: false,
        image: '/citarum-reboisasi.jpg',
        submittedAt: new Date().toISOString(),
      }
    ];
  });

  const [curationModalProject, setCurationModalProject] = useState(null);

  // Centralized Notifications with LocalStorage persistence
  const [notifications, setNotifications] = useState(() => {
    try {
      const stored = localStorage.getItem('styleup_notifications');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return NOTIFICATIONS;
  });

  function addNotification({ type = 'info', icon = 'notifications', title, message, link = null, linkText = null }) {
    const newNotif = {
      id: Date.now() + Math.random(),
      type,
      icon,
      title,
      message,
      time: 'Baru saja',
      read: false,
      link,
      linkText,
    };
    setNotifications((prev) => {
      const updated = [newNotif, ...prev];
      try {
        localStorage.setItem('styleup_notifications', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  }

  function handleMarkAllRead() {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }));
      try {
        localStorage.setItem('styleup_notifications', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  }

  function handleToggleRead(id) {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n));
      try {
        localStorage.setItem('styleup_notifications', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  }

  function handleDeleteNotification(id) {
    setNotifications((prev) => {
      const updated = prev.filter((n) => n.id !== id);
      try {
        localStorage.setItem('styleup_notifications', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  }

  function handleClearAllNotifications() {
    setNotifications([]);
    try {
      localStorage.setItem('styleup_notifications', JSON.stringify([]));
    } catch (e) {}
  }

  const unreadNotificationsCount = currentUser
    ? notifications.filter((n) => !n.read).length
    : 0;

  function requireAuth(title, message, targetPage = null, targetProject = null) {
    if (!currentUser) {
      setAuthModal({
        title: title || 'Akses Masuk Diperlukan',
        message: message || 'Silakan masuk ke akun Anda terlebih dahulu untuk mengakses fitur ini.',
        targetPage,
        targetProject,
      });
      return false;
    }
    return true;
  }

  function handleLogin(userData) {
    setCurrentUser(userData);
    handleNavigate('beranda');
    addNotification({
      type: 'info',
      icon: 'verified_user',
      title: `Selamat Datang, ${userData.name}! 👋`,
      message: 'Sesi masuk Anda telah aktif. Seluruh rekap donasi terverifikasi, jam relawan, dan sertifikasi keberlanjutan siap diakses.',
      link: 'profil',
      linkText: 'Lihat Profil Saya →',
    });
  }

  function handleGuestEnter() {
    setCurrentUser(null); // Guest mode
    handleNavigate('beranda');
  }

  function handleLogout() {
    setCurrentUser(null);
    handleNavigate('login');
  }

  function handleDonate(proj) {
    if (!currentUser) {
      requireAuth(
        'Masuk Diperlukan untuk Pembayaran',
        'Untuk menyalurkan donasi resmi melalui Escrow Bappenas RI serta penerbitan bukti potong pajak sah PMK-04, Anda wajib masuk ke akun terlebih dahulu.',
        'pembayaran',
        proj
      );
      return;
    }
    handleNavigate('pembayaran', proj);
  }

  function handleOpenCreateProject() {
    if (!currentUser) {
      requireAuth(
        'Masuk untuk Membuat Proyek Baru',
        'Pengajuan inisiatif proyek keberlanjutan baru memerlukan akun relawan atau lembaga terverifikasi untuk proses kurasi kelayakan Bappenas RI.'
      );
      return;
    }
    setCreateModalOpen(true);
  }

  // Listen to browser Back and Forward buttons (popstate)
  useEffect(() => {
    // Initial push state for starting page
    if (!window.history.state) {
      window.history.replaceState({ page: 'login', project: null }, '', '');
    }

    function handlePopState(event) {
      if (event.state && event.state.page) {
        setCurrentPage(event.state.page);
        if (event.state.project) {
          setSelectedProject(event.state.project);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  function handleNavigate(page, project = null) {
    // Auth Protected Routes for Guest Mode
    if (!currentUser) {
      if (page === 'pembayaran') {
        requireAuth(
          'Masuk Diperlukan untuk Pembayaran',
          'Untuk menyalurkan donasi resmi melalui Escrow Bappenas RI serta penerbitan bukti potong pajak sah PMK-04, Anda wajib masuk ke akun terlebih dahulu.',
          'pembayaran',
          project
        );
        return;
      }
      if (page === 'riwayat-pembayaran') {
        requireAuth(
          'Masuk untuk Melihat Riwayat Transaksi',
          'Riwayat donasi dan arsip bukti potong pajak PMK-04 tersimpan pada akun terdaftar Anda. Silakan masuk untuk melihat dokumen.',
          'riwayat-pembayaran'
        );
        return;
      }
      if (page === 'sertifikasi') {
        requireAuth(
          'Peringatan: Anda Harus Login Terlebih Dahulu',
          'Halaman sertifikasi resmi ISO 14064 dan brevet relawan hanya dapat diakses oleh akun terdaftar. Anda wajib masuk (login) terlebih dahulu.',
          'sertifikasi'
        );
        return;
      }
      if (page === 'profil') {
        requireAuth(
          'Peringatan: Anda Harus Login Terlebih Dahulu',
          'Portofolio SDGs, riwayat jam relawan, dan sertifikat emisi Anda hanya dapat diakses setelah login.',
          'profil'
        );
        return;
      }
    }

    if (page === 'cek-kurasi') {
      const targetProposal = project || submittedProposals[0] || {
        id: 9991,
        title: 'Inisiatif Aksi Keberlanjutan Komunitas Tapak',
        location: 'Kutai, Kalimantan Timur',
        status: 'pending',
        target: 250000000,
        volunteers: '0 / 50 Posisi',
        submittedAt: new Date().toISOString(),
      };
      setCurationModalProject(targetProposal);
      return;
    }

    if (project) {
      setSelectedProject(project);
    }
    // Push new history state to browser history so back button works inside the web app
    window.history.pushState({ page, project }, '', '');
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Full-screen Auth Pages
  if (currentPage === 'login' || currentPage === 'masuk') {
    return (
      <LoginPage
        onNavigate={handleNavigate}
        onLogin={handleLogin}
        onGuestEnter={handleGuestEnter}
      />
    );
  }
  if (currentPage === 'register' || currentPage === 'daftar') {
    return <RegisterPage onNavigate={handleNavigate} />;
  }
  if (currentPage === 'lupa-password' || currentPage === 'lupa-sandi') {
    return <LupaPasswordPage onNavigate={handleNavigate} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9ff] text-[#0b1c30] w-full overflow-x-clip relative">
      {/* Sticky Header with + Buat Proyek & Profile Directly Visible */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenCreateProject={handleOpenCreateProject}
        currentUser={currentUser}
        unreadNotificationsCount={unreadNotificationsCount}
        onLogout={handleLogout}
      />

      {/* Main Multi-Page Route Render */}
      <main className="flex-1 w-full flex flex-col">
        {currentPage === 'beranda' && (
          <BerandaPage
            onNavigate={handleNavigate}
            onSelectProject={(proj) => handleNavigate('detail-proyek', proj)}
            onDonate={handleDonate}
            currentUser={currentUser}
          />
        )}
        {currentPage === 'pemetaan' && (
          <PemetaanPage
            onNavigate={handleNavigate}
            onDonate={handleDonate}
            onOpenCreateProject={handleOpenCreateProject}
          />
        )}
        {currentPage === 'eksplorasi' && (
          <EksplorasiPage
            onNavigate={handleNavigate}
            onSelectProject={(proj) => handleNavigate('detail-proyek', proj)}
            onDonate={handleDonate}
          />
        )}
        {currentPage === 'pembayaran' && (
          <PembayaranPage
            onNavigate={handleNavigate}
            initialProject={selectedProject}
            currentUser={currentUser}
            onAddNotification={addNotification}
          />
        )}
        {currentPage === 'riwayat-pembayaran' && (
          <RiwayatPembayaranPage
            onNavigate={handleNavigate}
            currentUser={currentUser}
            onAddNotification={addNotification}
          />
        )}
        {currentPage === 'sertifikasi' && (
          <SertifikasiPage onNavigate={handleNavigate} currentUser={currentUser} />
        )}
        {currentPage === 'notifikasi' && (
          <NotifikasiPage
            onNavigate={handleNavigate}
            currentUser={currentUser}
            notifications={notifications}
            onMarkAllRead={handleMarkAllRead}
            onToggleRead={handleToggleRead}
            onDeleteNotification={handleDeleteNotification}
            onClearAll={handleClearAllNotifications}
          />
        )}
        {currentPage === 'profil' && (
          <ProfilPage onNavigate={handleNavigate} currentUser={currentUser} />
        )}
        {currentPage === 'detail-proyek' && (
          <DetailProyekPage
            project={selectedProject}
            onNavigate={handleNavigate}
            onDonate={handleDonate}
            currentUser={currentUser}
            onRequireAuth={requireAuth}
            onAddNotification={addNotification}
          />
        )}
      </main>

      {/* Global Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Interactive Create Project Modal */}
      <CreateProjectModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onProjectCreated={(newProject) => {
          // Simpan ke daftar pengajuan proposal
          setSubmittedProposals((prev) => {
            const updated = [newProject, ...prev];
            try {
              localStorage.setItem('styleup_submitted_proposals', JSON.stringify(updated));
            } catch (e) {}
            return updated;
          });

          // Berikan notifikasi bahwa proposal masuk ke antrean verifikasi admin
          addNotification({
            type: 'warning',
            icon: 'hourglass_top',
            title: 'Pengajuan Proyek Masuk Antrean Review ⏳',
            message: `Proposal "${newProject.title}" berhasil dikirim dan berstatus Menunggu Persetujuan Admin. Proyek akan dipublikasikan setelah lolos kurasi Bappenas RI.`,
            link: 'cek-kurasi',
            linkText: 'Cek Status Kurasi →',
          });
        }}
      />

      {/* Modal Cek Status Kurasi & Persetujuan Admin */}
      <StatusKurasiModal
        isOpen={Boolean(curationModalProject)}
        proposal={curationModalProject}
        onClose={() => setCurationModalProject(null)}
        onApprove={(proposal) => {
          // Setujui proyek: masukkan ke PROJECTS publik
          const approvedObj = {
            ...proposal,
            status: 'approved',
            verified: 'Disetujui Bappenas RI (Resmi)',
          };

          // Masukkan ke katalog publik
          PROJECTS.unshift(approvedObj);
          setSelectedProject(approvedObj);

          // Update status di daftar pengajuan
          setSubmittedProposals((prev) =>
            prev.map((p) => (p.id === proposal.id ? approvedObj : p))
          );

          addNotification({
            type: 'success',
            icon: 'check_circle',
            title: 'Proyek Anda Telah Disetujui! 🎉',
            message: `Inisiatif "${proposal.title}" telah lolos verifikasi Bappenas RI dan kini resmi tayang di katalog eksplorasi publik.`,
            link: 'eksplorasi',
            linkText: 'Buka di Eksplorasi →',
          });
        }}
        onReject={(proposal) => {
          // Tarik dari publik jika ditolak
          const idx = PROJECTS.findIndex((p) => p.id === proposal.id);
          if (idx !== -1) {
            PROJECTS.splice(idx, 1);
          }
          setSubmittedProposals((prev) =>
            prev.map((p) => (p.id === proposal.id ? { ...p, status: 'rejected' } : p))
          );
          addNotification({
            type: 'warning',
            icon: 'warning',
            title: 'Status Pengajuan Diperbarui',
            message: `Proyek "${proposal.title}" ditarik dari publik untuk peninjauan ulang.`,
            link: 'notifikasi',
            linkText: 'Lihat Notifikasi →',
          });
        }}
      />

      {/* Auth Required Interceptor Modal */}
      {authModal && (
        <div className="fixed inset-0 z-50 bg-[#0b1c30]/75 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-[#e5eeff] max-w-md w-full p-6 sm:p-8 flex flex-col items-center text-center animate-slide-up">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffdad6] text-[#ba1a1a] text-[11px] font-black uppercase tracking-wider mb-4">
              <span className="material-symbols-outlined text-sm">warning</span>
              PERINGATAN AKSES
            </div>

            <div className="w-16 h-16 rounded-2xl bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center mb-4 ring-8 ring-[#ffdad6]/40 shadow-sm">
              <span className="material-symbols-outlined text-3xl">lock_person</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-[#0b1c30] mb-2 leading-tight">
              {authModal.title || 'Peringatan: Anda Harus Login Terlebih Dahulu'}
            </h3>

            <p className="text-xs sm:text-sm text-[#404944] leading-relaxed mb-6 font-medium">
              {authModal.message || 'Anda sedang berada dalam Mode Tamu. Untuk dapat melakukan donasi sekarang, Anda wajib masuk (login) ke akun StyleUp Anda terlebih dahulu demi akuntabilitas penyaluran Bappenas RI.'}
            </p>

            <div className="flex flex-col gap-2.5 w-full">
              <button
                onClick={() => {
                  setAuthModal(null);
                  setCurrentPage('login');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full py-3 rounded-xl bg-[#0d503c] hover:bg-[#003828] text-white text-xs sm:text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <span className="material-symbols-outlined text-[18px]">login</span>
                <span>Masuk / Login Sekarang</span>
              </button>

              <button
                onClick={() => {
                  setAuthModal(null);
                  setCurrentPage('register');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full py-2.5 rounded-xl bg-[#eff4ff] hover:bg-[#e0e9f8] text-[#003828] text-xs font-bold transition-colors cursor-pointer"
              >
                Daftar Akun Baru
              </button>

              <button
                onClick={() => setAuthModal(null)}
                className="text-xs text-[#707974] hover:text-[#0b1c30] pt-1 transition-colors cursor-pointer"
              >
                Batal &amp; Tetap di Mode Tamu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
