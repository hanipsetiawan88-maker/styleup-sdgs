import { useState } from 'react';
import { PROJECTS } from '../data';

export default function DetailProyekPage({
  onNavigate,
  project: propProject,
  onDonate,
  currentUser,
  onRequireAuth,
  onAddNotification,
}) {
  const project = propProject || PROJECTS[0];
  const [activeTab, setActiveTab] = useState('deskripsi');
  const [volModal, setVolModal] = useState(false);
  const [volSuccess, setVolSuccess] = useState(false);
  const [loginWarning, setLoginWarning] = useState(false);
  const [volName, setVolName] = useState(currentUser?.name || 'Najlaa Khairunnisa Arwanto');
  const [volGender, setVolGender] = useState('Perempuan');
  const [volEmail, setVolEmail] = useState(currentUser?.email || 'najlaa.arwanto@esg-investama.id');
  const [volPhone, setVolPhone] = useState(currentUser?.phone || '+62 812-9842-1109');
  const [volCity, setVolCity] = useState('Kota Bandung, Jawa Barat');
  const [volAddress, setVolAddress] = useState('Jl. Dago Asri No. 42, Coblong');
  const [joinedWA, setJoinedWA] = useState(false);

  function handleDonateClick() {
    if (!currentUser) {
      if (onRequireAuth) {
        onRequireAuth(
          'Peringatan: Anda Harus Login Terlebih Dahulu',
          'Untuk dapat melakukan donasi sekarang, Anda wajib masuk (login) ke akun StyleUp Anda terlebih dahulu.',
          'pembayaran',
          project
        );
      } else {
        setLoginWarning(true);
      }
      return;
    }
    if (onDonate) {
      onDonate(project);
    } else {
      onNavigate('pembayaran', project);
    }
  }

  function handleOpenVolunteer() {
    if (!currentUser) {
      if (onRequireAuth) {
        onRequireAuth(
          'Peringatan: Anda Harus Login Terlebih Dahulu',
          'Untuk dapat bergabung menjadi relawan lapangan, Anda wajib masuk (login) ke akun StyleUp Anda terlebih dahulu.',
          'detail-proyek',
          project
        );
      } else {
        setLoginWarning(true);
      }
      return;
    }
    setVolModal(true);
  }

  function handleConfirmVolunteer() {
    setVolSuccess(true);
    if (onAddNotification) {
      onAddNotification({
        type: 'success',
        icon: 'volunteer_activism',
        title: 'Pendaftaran Relawan Berhasil! 🤝',
        message: `Anda resmi terdaftar sebagai relawan di "${project.title}". Silakan periksa grup koordinasi WhatsApp untuk pembagian jadwal aksi.`,
        link: 'profil',
        linkText: 'Lihat Portofolio Relawan →',
      });
    }
  }

  return (
    <main className="flex-1 w-full bg-[#f8f9ff]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">

        {/* Top Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#404944]">
          <button onClick={() => onNavigate('beranda')} className="hover:text-[#003828] transition-colors">Beranda</button>
          <span className="material-symbols-outlined text-sm text-[#707974]">chevron_right</span>
          <button onClick={() => onNavigate('eksplorasi')} className="hover:text-[#003828] transition-colors">Eksplorasi Proyek</button>
          <span className="material-symbols-outlined text-sm text-[#707974]">chevron_right</span>
          <span className="font-bold text-[#006c49] truncate max-w-xs">{project.title}</span>
        </div>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Media & Details (8 Cols) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Main Picture */}
            <div className="relative rounded-2xl overflow-hidden h-72 sm:h-96 shadow-md border border-[#e5eeff]">
              <img
                src={project.image}
                alt={project.title}
                onError={(e) => { e.currentTarget.src = '/delta-mahakam.jpg'; }}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                {project.sdgs.map(s => (
                  <span key={s.num} className="px-3 py-1 rounded-full text-white text-xs font-bold shadow-md" style={{ background: s.color }}>
                    SDG {s.num} {s.label}
                  </span>
                ))}
              </div>
              <div className="absolute bottom-4 left-4 right-4 bg-[#0b1c30]/80 backdrop-blur-md p-3.5 rounded-xl text-white flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-semibold">
                  <span className="material-symbols-outlined text-sm text-[#68fcbf]">location_on</span>
                  {project.location}
                </span>
                <span className="px-2.5 py-0.5 rounded bg-[#006c49] font-bold">Terverifikasi Satelit GNSS</span>
              </div>
            </div>

            {/* Title & Tabs */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#e5eeff]">
              <h1 className="text-xl sm:text-2xl font-bold text-[#0b1c30] mb-3">{project.title}</h1>
              <p className="text-xs sm:text-sm text-[#404944] leading-relaxed mb-6">{project.description}</p>

              {/* Tabs */}
              <div className="flex items-center gap-3 border-b border-[#eff4ff] pb-3 mb-6">
                {[
                  { id: 'deskripsi', label: 'Tentang Inisiatif' },
                  { id: 'milestone', label: 'Tahapan & Milestone' },
                  { id: 'relawan', label: 'Kebutuhan Relawan' },
                  { id: 'audit', label: 'Laporan Audit ESG' },
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      activeTab === t.id ? 'bg-[#0d503c] text-white shadow-sm' : 'text-[#404944] hover:bg-[#eff4ff]'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {activeTab === 'deskripsi' && (
                <div className="space-y-4 text-xs sm:text-sm text-[#404944] leading-relaxed">
                  <h3 className="font-bold text-[#0b1c30] text-sm sm:text-base">Latar Belakang &amp; Dampak Target</h3>
                  <p>
                    Kawasan Delta Mahakam mengalami degradasi tambak udang intensif selama 2 dekade terakhir yang menyebabkan abrasi pesisir hingga 15 meter per tahun. Program ini menanam 45.000 bibit Rhizophora Mucronata dengan partisipasi masyarakat lokal.
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                    <div className="p-3 rounded-xl bg-[#eff4ff]">
                      <div className="text-base font-bold text-[#003828]">150 Hektar</div>
                      <div className="text-[11px] text-[#707974]">Target Restorasi</div>
                    </div>
                    <div className="p-3 rounded-xl bg-[#eff4ff]">
                      <div className="text-base font-bold text-[#006c49]">2.400 Ton</div>
                      <div className="text-[11px] text-[#707974]">Estimasi Serapan CO₂e</div>
                    </div>
                    <div className="p-3 rounded-xl bg-[#eff4ff] col-span-2 sm:col-span-1">
                      <div className="text-base font-bold text-[#003828]">320 KK</div>
                      <div className="text-[11px] text-[#707974]">Penerima Manfaat Nelayan</div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'milestone' && (
                <div className="space-y-4">
                  {[
                    { step: 'Fase 1: Pembibitan Komunal', status: 'Selesai (100%)', desc: '45.000 bibit mangrove disemai di 3 nursery pesisir.', done: true },
                    { step: 'Fase 2: Pemancangan & Penanaman', status: 'Sedang Berjalan (77%)', desc: 'Penanaman bersama tim Manggala & 84 relawan terdaftar.', done: false },
                    { step: 'Fase 3: Audit Drone & Tagging GNSS', status: 'Mendatang (Q2 2026)', desc: 'Validasi kepadatan kanopi via satelit Sentinel-2.', done: false },
                  ].map((m, i) => (
                    <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl bg-[#eff4ff]">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                        m.done ? 'bg-[#006c49] text-white' : 'bg-white text-[#003828] border border-[#006c49]'
                      }`}>
                        {m.done ? <span className="material-symbols-outlined text-sm">check</span> : i + 1}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#0b1c30]">{m.step} <span className="text-[11px] font-semibold text-[#006c49]">({m.status})</span></div>
                        <div className="text-[11px] text-[#404944] mt-0.5">{m.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'relawan' && (
                <div className="space-y-3">
                  <p className="text-xs text-[#404944]">Dibutuhkan 16 relawan tambahan untuk batch penanaman akhir pekan ini.</p>
                  <div className="p-4 rounded-xl bg-[#eff4ff] border border-[#6cf8bb]">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-[#0b1c30]">Kualifikasi: Fisik Sehat &amp; Bersedia di Lapangan</span>
                      <span className="text-xs font-bold text-[#006c49]">84 / 100 Terdaftar</span>
                    </div>
                    <ul className="text-xs text-[#404944] space-y-1 list-disc pl-4 mb-3">
                      <li>Mengikuti pembekalan safety &amp; teknik tancap bibit</li>
                      <li>Mendapatkan sertifikat relawan resmi (Logbook GPS BNPB)</li>
                      <li>Akomodasi lokal &amp; konsumsi disediakan mitra lapangan</li>
                    </ul>
                    <button
                      onClick={() => setVolModal(true)}
                      className="px-4 py-2 rounded-xl bg-[#0d503c] text-white text-xs font-bold shadow-sm hover:bg-[#003828] transition-all"
                    >
                      Daftar Jadi Relawan Lapangan
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'audit' && (
                <div className="space-y-3 text-xs text-[#404944]">
                  <div className="p-3 rounded-xl bg-[#eff4ff] flex items-center justify-between">
                    <div>
                      <div className="font-bold text-[#0b1c30]">Audit Trail Rekening Escrow</div>
                      <div className="text-[11px]">Bank Mandiri Kustodian · Terverifikasi OJK</div>
                    </div>
                    <button className="px-3 py-1.5 rounded-lg bg-white text-[#003828] font-bold border border-[#bfc9c2]/40">Unduh PDF</button>
                  </div>
                  <div className="p-3 rounded-xl bg-[#eff4ff] flex items-center justify-between">
                    <div>
                      <div className="font-bold text-[#0b1c30]">Sertifikasi Metrik Serapan Karbon ISO 14064</div>
                      <div className="text-[11px]">Kementerian Lingkungan Hidup dan Kehutanan (KLHK)</div>
                    </div>
                    <button className="px-3 py-1.5 rounded-lg bg-white text-[#003828] font-bold border border-[#bfc9c2]/40">Unduh PDF</button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sticky Funding Card (4 Cols) */}
          <div className="lg:col-span-4 sticky top-24 flex flex-col gap-4">
            <div className="bg-white rounded-2xl p-6 shadow-md border border-[#e5eeff]">
              <span className="px-2.5 py-1 rounded-full bg-[#ffdad6] text-[#ba1a1a] text-xs font-bold inline-block mb-3">
                Sisa 6 Hari Lagi!
              </span>

              <div className="text-2xl font-bold text-[#003828] mb-1">
                Rp {(project.collected / 1000000).toFixed(0)} Juta
              </div>
              <div className="text-xs text-[#707974] mb-4">
                Terkumpul dari target <strong>Rp {(project.target / 1000000).toFixed(0)} Juta</strong> ({project.percent}%)
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2.5 rounded-full bg-[#eff4ff] overflow-hidden mb-5">
                <div className="h-full bg-[#006c49] rounded-full transition-all" style={{ width: `${project.percent}%` }} />
              </div>

              <div className="grid grid-cols-2 gap-2 text-center text-xs mb-6 pb-6 border-b border-[#eff4ff]">
                <div className="p-2.5 rounded-xl bg-[#eff4ff]">
                  <div className="font-bold text-[#0b1c30]">312</div>
                  <div className="text-[10px] text-[#707974]">Donatur Bergabung</div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#eff4ff]">
                  <div className="font-bold text-[#006c49]">84 Relawan</div>
                  <div className="text-[10px] text-[#707974]">Di Lokasi Aksi</div>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <button
                  onClick={handleDonateClick}
                  className="flex-1 py-3.5 rounded-full bg-[#0d503c] hover:bg-[#003828] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <span className="material-symbols-outlined text-lg">volunteer_activism</span>
                  Donasi Sekarang
                </button>
              </div>

              <button
                onClick={handleOpenVolunteer}
                className="w-full py-3 rounded-full bg-[#eff4ff] hover:bg-[#e5eeff] text-[#003828] text-xs font-bold transition-all text-center cursor-pointer"
              >
                Bergabung Jadi Relawan Lapangan
              </button>

              <div className="mt-4 pt-4 border-t border-[#eff4ff] text-[11px] text-[#707974] text-center">
                <span className="flex items-center justify-center gap-1 text-[#006c49] font-semibold mb-1">
                  <span className="material-symbols-outlined text-xs">shield</span> Escrow Account Bappenas Terjamin
                </span>
                Dana disalurkan bertahap sesuai validasi bukti fisik penanaman.
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Volunteer Modal */}
      {volModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b1c30]/60 backdrop-blur-sm p-4 animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-lg w-full p-5 sm:p-6 text-center space-y-4 my-auto max-h-[92vh] overflow-y-auto border border-[#e5eeff]">
            {!volSuccess ? (
              <>
                <div className="w-12 h-12 rounded-full bg-[#eff4ff] flex items-center justify-center text-[#006c49] mx-auto">
                  <span className="material-symbols-outlined text-2xl">how_to_reg</span>
                </div>
                
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#0b1c30]">Daftar Relawan Lapangan</h3>
                  <p className="text-xs text-[#404944] mt-1">
                    Anda mendaftar untuk proyek <strong>{project.title}</strong> di {project.location}.
                  </p>
                </div>

                <div className="space-y-3 text-left text-xs pt-1">
                  {/* Nama Lengkap */}
                  <div>
                    <label className="font-bold text-[#0b1c30] block mb-1">
                      Nama Lengkap <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={volName}
                      onChange={e => setVolName(e.target.value)}
                      className="w-full bg-[#f8f9ff] border border-[#e5eeff] focus:border-[#006c49] focus:outline-none p-2.5 rounded-xl font-medium"
                      placeholder="Masukkan nama lengkap"
                    />
                  </div>

                  {/* Jenis Kelamin & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-[#0b1c30] block mb-1">
                        Jenis Kelamin <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={volGender}
                        onChange={e => setVolGender(e.target.value)}
                        className="w-full bg-[#f8f9ff] border border-[#e5eeff] focus:border-[#006c49] focus:outline-none p-2.5 rounded-xl font-medium text-xs"
                      >
                        <option value="Perempuan">Perempuan</option>
                        <option value="Laki-laki">Laki-laki</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-[#0b1c30] block mb-1">
                        Email Aktif <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={volEmail}
                        onChange={e => setVolEmail(e.target.value)}
                        className="w-full bg-[#f8f9ff] border border-[#e5eeff] focus:border-[#006c49] focus:outline-none p-2.5 rounded-xl font-medium"
                        placeholder="contoh@domain.com"
                      />
                    </div>
                  </div>

                  {/* WhatsApp & Tempat Tinggal / Domisili */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-[#0b1c30] block mb-1">
                        Nomor WhatsApp Aktif <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={volPhone}
                        onChange={e => setVolPhone(e.target.value)}
                        className="w-full bg-[#f8f9ff] border border-[#e5eeff] focus:border-[#006c49] focus:outline-none p-2.5 rounded-xl font-medium"
                        placeholder="+62 812-xxxx-xxxx"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-[#0b1c30] block mb-1">
                        Tempat Tinggal / Domisili <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={volCity}
                        onChange={e => setVolCity(e.target.value)}
                        className="w-full bg-[#f8f9ff] border border-[#e5eeff] focus:border-[#006c49] focus:outline-none p-2.5 rounded-xl font-medium"
                        placeholder="Contoh: Kota Bandung / Jakarta Selatan"
                      />
                    </div>
                  </div>

                  {/* Alamat Lengkap */}
                  <div>
                    <label className="font-bold text-[#0b1c30] block mb-1">
                      Alamat Lengkap <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={2}
                      value={volAddress}
                      onChange={e => setVolAddress(e.target.value)}
                      className="w-full bg-[#f8f9ff] border border-[#e5eeff] focus:border-[#006c49] focus:outline-none p-2.5 rounded-xl font-medium resize-none"
                      placeholder="Nama jalan, RT/RW, nomor rumah, kelurahan/kecamatan"
                    />
                  </div>

                  {/* Informasi Grup WA Alert */}
                  <div className="p-3 rounded-xl bg-[#eff4ff] border border-[#dce9ff] text-[11px] text-[#003828] flex items-start gap-2">
                    <span className="material-symbols-outlined text-[#006c49] text-base shrink-0 mt-0.5">chat</span>
                    <span>
                      <strong>Pemberitahuan:</strong> Setelah mendaftar, Anda akan langsung diarahkan untuk masuk ke <strong>Grup WhatsApp Koordinasi Relawan</strong> proyek ini.
                    </span>
                  </div>
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    onClick={handleConfirmVolunteer}
                    className="flex-1 py-3 rounded-xl bg-[#0d503c] hover:bg-[#003828] text-white text-xs font-bold transition-all shadow-md cursor-pointer hover:scale-[1.01]"
                  >
                    Konfirmasi Pendaftaran
                  </button>
                  <button
                    onClick={() => setVolModal(false)}
                    className="px-5 py-3 rounded-xl bg-[#eff4ff] hover:bg-[#e5eeff] text-[#0b1c30] text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-4 py-1 text-center">
                <div className="w-14 h-14 rounded-full bg-[#6cf8bb]/30 flex items-center justify-center text-[#006c49] mx-auto ring-8 ring-[#6cf8bb]/15">
                  <span className="material-symbols-outlined text-3xl">check_circle</span>
                </div>

                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#6cf8bb]/40 text-[#00513b] text-[10px] font-bold uppercase tracking-wider">
                    Pendaftaran Relawan Berhasil!
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-[#0b1c30] mt-1.5">
                    Selamat Bergabung, {volName.split(' ')[0]}! 🎉
                  </h3>
                  <p className="text-xs text-[#404944] mt-1 leading-relaxed">
                    Data relawan Anda telah tercatat untuk proyek <strong>{project.title}</strong> ({volCity}).
                  </p>
                </div>

                {/* WhatsApp Group Invitation Card */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-[#f0fdf4] to-[#dcfce7] border border-[#86efac] text-left space-y-3 shadow-sm">
                  <div className="flex items-center gap-2.5 text-[#166534]">
                    <div className="w-10 h-10 rounded-xl bg-[#25D366] text-white flex items-center justify-center shadow-xs shrink-0">
                      <span className="material-symbols-outlined text-2xl">chat</span>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#14532d]">Wajib Masuk Grup WhatsApp Relawan</h4>
                      <p className="text-[11px] text-[#166534]">Grup Koordinasi Tim Aksi Lapangan</p>
                    </div>
                  </div>

                  <p className="text-[11px] text-[#14532d] leading-relaxed">
                    Akun Anda telah terdaftar. Silakan segera masuk ke Grup WhatsApp resmi agar koordinator lapangan dapat membagikan <strong>titik kumpul, seragam rompi relawan, jadwal aksi, dan briefing keselamatan</strong>:
                  </p>

                  <a
                    href="https://chat.whatsapp.com/invite/SDGs-Relawan-Indonesia"
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => setJoinedWA(true)}
                    className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#1fa951] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02]"
                  >
                    <span className="material-symbols-outlined text-base">groups</span>
                    <span>{joinedWA ? '✓ Anda Sudah Masuk Grup WA' : 'Masuk Grup WhatsApp Relawan Sekarang'}</span>
                    <span className="material-symbols-outlined text-sm">open_in_new</span>
                  </a>

                  <div className="flex items-start gap-1.5 text-[10px] text-[#15803d] pt-1 border-t border-[#bbf7d0]">
                    <span className="material-symbols-outlined text-xs shrink-0 mt-0.5">verified_user</span>
                    <span>Link undangan dan konfirmasi e-ID relawan juga telah dikirim ke WhatsApp <strong>{volPhone}</strong> dan email <strong>{volEmail}</strong>.</span>
                  </div>
                </div>

                <div className="pt-1">
                  <button
                    onClick={() => {
                      setVolSuccess(false);
                      setVolModal(false);
                      setJoinedWA(false);
                    }}
                    className="w-full py-2.5 rounded-xl bg-[#0d503c] hover:bg-[#003828] text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
                  >
                    Selesai &amp; Kembali ke Proyek
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Login Warning Alert Modal */}
      {loginWarning && (
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
              Peringatan: Anda Harus Login Terlebih Dahulu
            </h3>

            <p className="text-xs sm:text-sm text-[#404944] leading-relaxed mb-6 font-medium">
              Anda sedang menjelajahi website dalam <strong>Mode Tamu Tanpa Akun</strong>. Untuk melakukan donasi sekarang atau mendaftar relawan, Anda wajib masuk (login) ke akun StyleUp Anda terlebih dahulu demi akuntabilitas penyaluran Bappenas RI.
            </p>

            <div className="flex flex-col gap-2.5 w-full">
              <button
                onClick={() => {
                  setLoginWarning(false);
                  onNavigate('login');
                }}
                className="w-full py-3 rounded-xl bg-[#0d503c] hover:bg-[#003828] text-white text-xs sm:text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <span className="material-symbols-outlined text-[18px]">login</span>
                <span>Masuk / Login Sekarang</span>
              </button>

              <button
                onClick={() => {
                  setLoginWarning(false);
                  onNavigate('register');
                }}
                className="w-full py-2.5 rounded-xl bg-[#eff4ff] hover:bg-[#e0e9f8] text-[#003828] text-xs font-bold transition-colors cursor-pointer"
              >
                Daftar Akun Baru
              </button>

              <button
                onClick={() => setLoginWarning(false)}
                className="text-xs text-[#707974] hover:text-[#0b1c30] pt-1 transition-colors cursor-pointer"
              >
                Batal &amp; Tetap di Mode Tamu
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
