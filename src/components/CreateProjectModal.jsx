import { useState, useEffect, useRef } from 'react';
import { ALL_SDGS } from '../data';
import { WILAYAH_INDONESIA, PROVINSI_KEYS } from '../data/indonesiaRegions';

export default function CreateProjectModal({ isOpen, onClose, onProjectCreated }) {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [trackingId, setTrackingId] = useState('');
  const fileInputRef = useRef(null);

  // Form States
  const [title, setTitle] = useState('');
  const [selectedSDGs, setSelectedSDGs] = useState([13, 14]);
  const [province, setProvince] = useState('Jawa Barat');
  const [city, setCity] = useState(WILAYAH_INDONESIA['Jawa Barat'][0]);
  const [urgency, setUrgency] = useState('biasa'); // 'mendesak' | 'urgent' | 'biasa'
  const [targetAmount, setTargetAmount] = useState('250000000');
  const [volunteersNeeded, setVolunteersNeeded] = useState('50');
  const [duration, setDuration] = useState('6 Bulan');
  const [description, setDescription] = useState('');
  const [initiatorName, setInitiatorName] = useState('Komunitas Generasi Hijau Indonesia');
  const [picName, setPicName] = useState('Najlaa Khairunnisa Arwanto');
  const [whatsapp, setWhatsapp] = useState('+62 812-9842-1109');
  const [attachedDoc, setAttachedDoc] = useState('');
  const [attachedFileSize, setAttachedFileSize] = useState('');

  // Reset form to fresh state whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setSubmitted(false);
      setStep(1);
      setUrgency('biasa');
    }
  }, [isOpen]);

  function handleCloseModal() {
    setSubmitted(false);
    setStep(1);
    setTitle('');
    setDescription('');
    setUrgency('biasa');
    setAttachedDoc('');
    setAttachedFileSize('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    onClose();
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (file) {
      const sizeStr = file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${(file.size / 1024).toFixed(0)} KB`;
      setAttachedDoc(file.name);
      setAttachedFileSize(sizeStr);
    }
  }

  function handleProvinceChange(newProv) {
    setProvince(newProv);
    const cities = WILAYAH_INDONESIA[newProv] || [];
    setCity(cities[0] || '');
  }

  if (!isOpen) return null;

  function toggleSDG(num) {
    if (selectedSDGs.includes(num)) {
      if (selectedSDGs.length > 1) {
        setSelectedSDGs(selectedSDGs.filter((n) => n !== num));
      }
    } else {
      setSelectedSDGs([...selectedSDGs, num]);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const newId = `PRJ-SDG-${Date.now().toString().slice(-4)}`;
    setTrackingId(newId);

    const sdgObjs = selectedSDGs.map((num) => {
      const found = ALL_SDGS.find((s) => s.num === num);
      return {
        num,
        label: found ? found.title : `SDG ${num}`,
        color: found ? found.color : '#006c49',
      };
    });

    const newProjectObj = {
      id: Date.now(),
      title: title || 'Inisiatif Aksi Keberlanjutan Komunitas Tapak',
      description: description || 'Program percepatan implementasi target SDGs di tingkat komunitas melalui partisipasi warga, audit geospasial real-time, dan insentif keberlanjutan terverifikasi.',
      location: `${city || 'Kota Bandung'}, ${province}`,
      sdgs: sdgObjs,
      status: 'pending',
      verified: 'Menunggu Persetujuan Admin',
      collected: 0,
      target: parseInt(targetAmount, 10) || 100000000,
      percent: 0,
      volunteers: `0 / ${volunteersNeeded || '50'}`,
      daysLeft: urgency === 'mendesak' ? 7 : urgency === 'urgent' ? 21 : 60,
      urgent: urgency === 'mendesak' || urgency === 'urgent',
      urgencyLevel: urgency, // 'mendesak' | 'urgent' | 'biasa'
      image: '/citarum-reboisasi.jpg',
      submittedAt: new Date().toISOString(),
    };

    setSubmitted(true);
    if (onProjectCreated) {
      onProjectCreated(newProjectObj);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl border border-[#e5eeff] flex flex-col gap-4 my-auto max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#e5eeff]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0d503c] to-[#006c49] text-white flex items-center justify-center shadow-sm shrink-0">
              <span className="material-symbols-outlined text-[22px] text-[#6cf8bb]">add_circle</span>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#0b1c30] leading-tight">
                Pendaftaran &amp; Inisiasi Proyek SDGs Baru
              </h3>
              <p className="text-xs text-[#707974] mt-0.5">
                Kemitraan Resmi Verifikasi Aksi Lapangan Bappenas RI
              </p>
            </div>
          </div>
          <button
            onClick={handleCloseModal}
            className="w-8 h-8 rounded-full bg-[#eff4ff] hover:bg-[#e0e9f8] text-[#404944] flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
            
            {/* Step Tabs */}
            <div className="grid grid-cols-3 gap-2 pb-1">
              {[
                { s: 1, label: '1. Data Inisiatif' },
                { s: 2, label: '2. Target & Dana' },
                { s: 3, label: '3. Data Pengajuan' },
              ].map((t) => (
                <button
                  key={t.s}
                  type="button"
                  onClick={() => setStep(t.s)}
                  className={`py-2 px-2 rounded-xl font-bold text-center transition-all cursor-pointer ${
                    step === t.s
                      ? 'bg-[#0d503c] text-white shadow-xs'
                      : 'bg-[#f0f4f9] text-[#707974] hover:bg-[#e5eeff]'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* TAB 1: DATA INISIATIF */}
            {step === 1 && (
              <div className="flex flex-col gap-3.5 animate-fade-in">
                <div>
                  <label className="font-bold text-[#0b1c30] block mb-1">
                    Judul Proyek / Inisiatif <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Contoh: Restorasi 50 Ha Terumbu Karang Teluk Saleh & Konservasi Penyu"
                    className="w-full bg-[#f8f9ff] border border-[#bfc9c2] focus:border-[#006c49] focus:outline-none p-2.5 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-[#0b1c30]">
                      Pilih Sasaran SDGs Terkait <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[10px] text-[#006c49] font-semibold">
                      {selectedSDGs.length} Dipilih
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-2 bg-[#f8f9ff] rounded-xl border border-[#e5eeff]">
                    {ALL_SDGS.map((s) => {
                      const isSel = selectedSDGs.includes(s.num);
                      return (
                        <button
                          key={s.num}
                          type="button"
                          onClick={() => toggleSDG(s.num)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                            isSel
                              ? 'text-white shadow-xs'
                              : 'bg-white text-[#404944] border border-[#e5eeff] hover:bg-[#eff4ff]'
                          }`}
                          style={{ backgroundColor: isSel ? s.color : undefined }}
                        >
                          <span>SDG {s.num}</span>
                          {isSel && <span className="material-symbols-outlined text-[12px]">check</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-[#0b1c30] block mb-1">
                      Provinsi Lokasi Aksi <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={province}
                      onChange={(e) => handleProvinceChange(e.target.value)}
                      className="w-full bg-[#f8f9ff] border border-[#bfc9c2] focus:border-[#006c49] focus:outline-none p-2.5 rounded-xl text-xs font-medium cursor-pointer"
                    >
                      {PROVINSI_KEYS.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-[#0b1c30] block mb-1">
                      Kabupaten / Kota <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-[#f8f9ff] border border-[#bfc9c2] focus:border-[#006c49] focus:outline-none p-2.5 rounded-xl text-xs font-medium cursor-pointer"
                    >
                      {(WILAYAH_INDONESIA[province] || []).map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-[#0b1c30] block mb-1">
                    Deskripsi Ringkas &amp; Rencana Aksi <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Jelaskan latar belakang permasalahan, target fisik (misal: jumlah bibit/buku), serta partisipasi masyarakat lokal..."
                    className="w-full bg-[#f8f9ff] border border-[#bfc9c2] focus:border-[#006c49] focus:outline-none p-2.5 rounded-xl text-xs resize-none"
                  />
                </div>

                {/* Fitur Urgensi: Mendesak - Urgent - Biasa */}
                <div>
                  <label className="font-bold text-[#0b1c30] block mb-1.5">
                    Tingkat Urgensi Kebutuhan Proyek <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      {
                        id: 'mendesak',
                        label: 'Mendesak',
                        desc: 'Darurat / Kritis',
                        badge: '7 Hari',
                        activeClass: 'bg-[#ffdad6] text-[#ba1a1a] border-[#ba1a1a] ring-2 ring-[#ba1a1a]/30 shadow-xs font-bold',
                        inactiveClass: 'bg-[#fff5f5] text-[#ba1a1a]/80 border-[#ffdad6] hover:bg-[#ffdad6]/40',
                        dot: 'bg-[#ba1a1a]',
                      },
                      {
                        id: 'urgent',
                        label: 'Urgent',
                        desc: 'Prioritas Cepat',
                        badge: '21 Hari',
                        activeClass: 'bg-[#fef3c7] text-[#92400e] border-[#d97706] ring-2 ring-[#d97706]/30 shadow-xs font-bold',
                        inactiveClass: 'bg-[#fffbeb] text-[#92400e]/80 border-[#fef3c7] hover:bg-[#fef3c7]/60',
                        dot: 'bg-[#d97706]',
                      },
                      {
                        id: 'biasa',
                        label: 'Biasa',
                        desc: 'Rutin Berkelanjutan',
                        badge: '60 Hari',
                        activeClass: 'bg-[#edf9f3] text-[#00513b] border-[#006c49] ring-2 ring-[#006c49]/30 shadow-xs font-bold',
                        inactiveClass: 'bg-[#f8f9ff] text-[#404944] border-[#e5eeff] hover:bg-[#eff4ff]',
                        dot: 'bg-[#006c49]',
                      },
                    ].map((lvl) => {
                      const isSelected = urgency === lvl.id;
                      return (
                        <button
                          key={lvl.id}
                          type="button"
                          onClick={() => setUrgency(lvl.id)}
                          className={`p-2.5 rounded-xl border flex flex-col items-center text-center gap-1 transition-all cursor-pointer ${
                            isSelected ? lvl.activeClass : lvl.inactiveClass
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${lvl.dot} ${isSelected && lvl.id === 'mendesak' ? 'animate-ping' : ''}`} />
                            <span className="text-xs">{lvl.label}</span>
                          </div>
                          <span className="text-[10px] opacity-80 leading-tight">{lvl.desc}</span>
                          <span className="text-[9.5px] font-bold px-1.5 py-0.2 rounded-md bg-white/80 border border-black/5 mt-0.5">
                            {lvl.badge}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: TARGET & DANA */}
            {step === 2 && (
              <div className="flex flex-col gap-3.5 animate-fade-in">
                <div>
                  <label className="font-bold text-[#0b1c30] block mb-1">
                    Dana yang Disalurkan (Rp) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-[#707974]">Rp</span>
                    <input
                      type="number"
                      required
                      min={1000000}
                      step={5000000}
                      value={targetAmount}
                      onChange={(e) => setTargetAmount(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 bg-[#f8f9ff] border border-[#bfc9c2] focus:border-[#006c49] focus:outline-none rounded-xl text-xs font-bold"
                    />
                  </div>
                  <span className="text-[10px] text-[#006c49] mt-1 block">
                    ✓ 100% donasi disalurkan utuh melalui Escrow Account Bappenas tanpa potongan platform.
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-[#0b1c30] block mb-1">
                      Kebutuhan Relawan Lapangan (Orang) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min={5}
                      value={volunteersNeeded}
                      onChange={(e) => setVolunteersNeeded(e.target.value)}
                      className="w-full bg-[#f8f9ff] border border-[#bfc9c2] focus:border-[#006c49] focus:outline-none p-2.5 rounded-xl text-xs"
                      placeholder="Contoh: 50"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[#0b1c30] block mb-1">
                      Estimasi Durasi Program <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full bg-[#f8f9ff] border border-[#bfc9c2] focus:border-[#006c49] focus:outline-none p-2.5 rounded-xl text-xs"
                    >
                      <option value="3 Bulan">3 Bulan (Tahap Cepat)</option>
                      <option value="6 Bulan">6 Bulan (Standar)</option>
                      <option value="12 Bulan">1 Tahun (Multi-Kuartal)</option>
                    </select>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#eff4ff] border border-[#dce9ff] flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-[#006c49] text-lg shrink-0 mt-0.5">verified_user</span>
                  <div className="space-y-0.5">
                    <strong className="text-[#003828] text-[11px] block">Standar Akuntabilitas ISO 14064</strong>
                    <p className="text-[10px] text-[#404944] leading-relaxed">
                      Setiap dana yang ditarik wajib disertai laporan bukti geolokasi GNSS foto bertag waktu dan bukti tanam/pembangunan fisik di lapangan.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: LEGALITAS & PIC */}
            {step === 3 && (
              <div className="flex flex-col gap-3.5 animate-fade-in">
                <div>
                  <label className="font-bold text-[#0b1c30] block mb-1">
                    Nama Komunitas / Yayasan / Organisasi Pengusul <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={initiatorName}
                    onChange={(e) => setInitiatorName(e.target.value)}
                    className="w-full bg-[#f8f9ff] border border-[#bfc9c2] focus:border-[#006c49] focus:outline-none p-2.5 rounded-xl text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-[#0b1c30] block mb-1">
                      Nama Koordinator / PIC <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={picName}
                      onChange={(e) => setPicName(e.target.value)}
                      className="w-full bg-[#f8f9ff] border border-[#bfc9c2] focus:border-[#006c49] focus:outline-none p-2.5 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#0b1c30] block mb-1">
                      Nomor WhatsApp PIC <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className="w-full bg-[#f8f9ff] border border-[#bfc9c2] focus:border-[#006c49] focus:outline-none p-2.5 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-[#0b1c30] block mb-1">
                    Upload Dokumen Proposal &amp; Legalitas Pendukung (PDF / Dokumen) <span className="text-red-500">*</span>
                  </label>
                  
                  {/* Hidden Native File Input (Connected to Laptop & Mobile File Picker) */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {attachedDoc ? (
                    <div className="p-3.5 rounded-xl border border-[#006c49]/40 bg-[#f0f9f5] flex items-center justify-between gap-3 animate-fade-in">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-[#006c49] text-[#6cf8bb] flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-xl">description</span>
                        </div>
                        <div className="min-w-0">
                          <span className="font-bold text-[#0b1c30] text-xs block truncate">{attachedDoc}</span>
                          <span className="text-[10px] text-[#707974]">{attachedFileSize || 'File Terpilih'} • Siap Dilampirkan</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-2.5 py-1.5 rounded-lg bg-white border border-[#e5eeff] hover:bg-[#eff4ff] text-[#006c49] text-[11px] font-bold transition-all cursor-pointer shadow-2xs"
                        >
                          Ganti File
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setAttachedDoc('');
                            setAttachedFileSize('');
                            if (fileInputRef.current) fileInputRef.current.value = '';
                          }}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-all cursor-pointer"
                          title="Hapus File"
                        >
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="p-4 sm:p-5 rounded-xl border-2 border-dashed border-[#006c49]/35 bg-[#f8f9ff] hover:bg-[#eff4ff]/60 hover:border-[#006c49] transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-1.5 group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-[#eff4ff] group-hover:bg-[#dce9ff] text-[#006c49] flex items-center justify-center transition-all">
                        <span className="material-symbols-outlined text-2xl">upload_file</span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#0b1c30] group-hover:text-[#006c49] transition-colors">
                          Upload File Dokumen Proposal
                        </p>
                        <p className="text-[11px] text-[#707974] mt-0.5">
                          Klik untuk memilih file dari laptop atau HP (PDF, DOCX, XLS maks 15MB)
                        </p>
                      </div>
                      <span className="px-3 py-1 rounded-lg bg-[#0d503c] text-white text-[11px] font-bold shadow-xs group-hover:bg-[#003828] transition-all mt-1">
                        Pilih File dari Perangkat
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Modal Navigation Buttons */}
            <div className="flex items-center justify-between gap-2.5 pt-3 border-t border-[#e5eeff]">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-4 py-2.5 rounded-xl bg-[#eff4ff] hover:bg-[#e0e9f8] text-[#003828] font-bold text-xs cursor-pointer transition-colors"
                >
                  ← Langkah Sebelumnya
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-[#eff4ff] hover:bg-[#e0e9f8] text-[#404944] font-semibold text-xs cursor-pointer"
                >
                  Batal
                </button>
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="px-5 py-2.5 rounded-xl bg-[#0d503c] hover:bg-[#003828] text-white font-bold text-xs cursor-pointer transition-all shadow-xs flex items-center gap-1"
                >
                  <span>Lanjutkan</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#006c49] hover:bg-[#003828] text-white font-bold text-xs cursor-pointer transition-all shadow-md hover:scale-105 flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-base">send</span>
                  <span>Kirim Pengajuan Proyek</span>
                </button>
              )}
            </div>

          </form>
        ) : (
          /* SUCCESS STATE - MENUNGGU PERSETUJUAN ADMIN */
          <div className="flex flex-col items-center text-center gap-4 py-3 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-[#fef08a] text-[#854d0e] flex items-center justify-center ring-8 ring-[#fef08a]/40">
              <span className="material-symbols-outlined text-4xl">hourglass_top</span>
            </div>

            <div>
              <span className="px-3 py-1 rounded-full bg-[#fef08a] text-[#854d0e] text-xs font-bold uppercase tracking-wider">
                Menunggu Persetujuan Admin
              </span>
              <h3 className="text-lg font-bold text-[#0b1c30] mt-2">
                Pengajuan Proyek Berhasil Dikirim! ⏳
              </h3>
              <p className="text-xs text-[#707974] mt-1 max-w-md mx-auto leading-relaxed">
                Inisiatif <strong>"{title || 'Aksi Keberlanjutan Komunitas'}"</strong> telah masuk ke sistem moderasi. Proyek ini <strong>tidak akan langsung tampil ke publik</strong> sebelum ditinjau dan disetujui oleh Administrator Bappenas RI.
              </p>
            </div>

            <div className="w-full p-4 rounded-2xl bg-[#f8f9ff] border border-[#e5eeff] text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#707974]">Nomor Pengajuan:</span>
                <span className="font-mono font-bold text-[#006c49]">{trackingId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#707974]">Status Kurasi:</span>
                <span className="font-bold text-[#854d0e] flex items-center gap-1.5 bg-[#fef9c3] px-2.5 py-0.5 rounded-full text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-[#ca8a04] animate-ping" />
                  Menunggu Persetujuan Admin
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#707974]">Tingkat Urgensi:</span>
                <span className={`font-bold flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] ${
                  urgency === 'mendesak'
                    ? 'bg-[#ffdad6] text-[#ba1a1a]'
                    : urgency === 'urgent'
                    ? 'bg-[#fef3c7] text-[#92400e]'
                    : 'bg-[#edf9f3] text-[#00513b]'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    urgency === 'mendesak' ? 'bg-[#ba1a1a] animate-ping' : urgency === 'urgent' ? 'bg-[#d97706]' : 'bg-[#00513b]'
                  }`} />
                  {urgency === 'mendesak' ? 'Mendesak (Darurat)' : urgency === 'urgent' ? 'Urgent (Prioritas)' : 'Biasa (Rutin)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#707974]">Estimasi Tinjauan:</span>
                <span className="font-semibold text-[#0b1c30]">14 Hari Kerja</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#707974]">Kontak Notifikasi:</span>
                <span className="font-semibold text-[#0b1c30]">{whatsapp}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 w-full pt-1">
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setStep(1);
                  setTitle('');
                  setDescription('');
                }}
                className="flex-1 py-3 rounded-xl bg-[#eff4ff] hover:bg-[#e0e9f8] text-[#003828] text-xs font-bold transition-all cursor-pointer flex items-center justify-center"
              >
                <span>Buat Proyek Baru Lagi</span>
              </button>
              <button
                type="button"
                onClick={handleCloseModal}
                className="flex-1 py-3 rounded-xl bg-[#0d503c] hover:bg-[#003828] text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center justify-center"
              >
                <span>Selesai &amp; Tutup</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
