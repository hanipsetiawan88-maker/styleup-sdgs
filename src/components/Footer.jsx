import { LOGO_URL } from '../data';

export default function Footer({ onNavigate }) {
  return (
    <footer className="w-full bg-[#eff4ff] border-t border-[#bfc9c2]/30 mt-8">
      <div className="w-full max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-[#bfc9c2]/25">
          {/* Brand */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <img src={LOGO_URL} alt="StyleUp Sustainability" className="h-10 w-auto object-contain" />
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#6cf8bb]/40 text-[#00513b] font-bold uppercase tracking-wider">
                SDGs Partner
              </span>
            </div>
            <p className="text-xs text-[#404944] max-w-sm leading-relaxed">
              Platform kolaborasi terbuka nasional akselerasi 17 Tujuan Pembangunan Berkelanjutan di Indonesia, menghubungkan inisiator tapak, pendanaan ESG, dan relawan terverifikasi.
            </p>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 px-3 py-1 rounded-md bg-[#e5eeff] text-[#0b1c30] text-[11px] font-semibold border border-[#bfc9c2]/30">
                <span className="material-symbols-outlined text-[#006c49]" style={{ fontSize: 14 }}>verified</span>
                Bappenas SDGs Partner
              </span>
              <span className="flex items-center gap-1 px-3 py-1 rounded-md bg-[#e5eeff] text-[#0b1c30] text-[11px] font-semibold border border-[#bfc9c2]/30">
                <span className="material-symbols-outlined text-[#006c49]" style={{ fontSize: 14 }}>workspace_premium</span>
                ISO 14064 MRV
              </span>
            </div>
          </div>

          {/* Navigasi */}
          <div>
            <h4 className="text-sm font-bold text-[#0b1c30] mb-4">Navigasi Platform</h4>
            <ul className="space-y-2 text-xs text-[#404944]">
              {[
                { label: 'Beranda Dashboard', page: 'beranda' },
                { label: 'Pemetaan SDGs', page: 'pemetaan' },
                { label: 'Eksplorasi Proyek', page: 'eksplorasi' },
                { label: 'Kanal Pembayaran', page: 'pembayaran' },
                { label: 'Pusat Sertifikasi', page: 'sertifikasi' },
              ].map(item => (
                <li key={item.page}>
                  <button onClick={() => onNavigate(item.page)} className="hover:text-[#003828] transition-colors text-left">
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Mitra */}
          <div>
            <h4 className="text-sm font-bold text-[#0b1c30] mb-4">Mitra &amp; Ekosistem</h4>
            <ul className="space-y-2 text-xs text-[#404944]">
              {['Bappenas RI SDGs Secretariat', 'United Nations Indonesia', 'Konsorsium Filantropi Hijau', 'Aliansi Komunitas Lestari', 'KLHK Indonesia'].map(m => (
                <li key={m}><span className="hover:text-[#003828] cursor-pointer transition-colors">{m}</span></li>
              ))}
            </ul>
          </div>

          {/* Kepatuhan & Akun */}
          <div>
            <h4 className="text-sm font-bold text-[#0b1c30] mb-4">Akun &amp; Kepatuhan</h4>
            <ul className="space-y-2 text-xs text-[#404944] mb-4">
              <li>
                <button onClick={() => onNavigate('register')} className="hover:text-[#003828] font-semibold text-[#006c49] transition-colors text-left cursor-pointer">
                  + Pendaftaran Akun Baru
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('login')} className="hover:text-[#003828] transition-colors text-left cursor-pointer">
                  Masuk ke Akun
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('lupa-password')} className="hover:text-[#003828] transition-colors text-left cursor-pointer">
                  Lupa Kata Sandi
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('profil')} className="hover:text-[#003828] transition-colors text-left cursor-pointer">
                  Profil &amp; Portofolio Saya
                </button>
              </li>
            </ul>
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#6cf8bb]/50 text-[#00714d] text-xs font-semibold">
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>verified</span>
              Terverifikasi ISO 14064 &amp; GRI
            </span>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#404944]">
          <p>© 2025 StyleUp Sustainability Platform. Hak Cipta Dilindungi.</p>
          <div className="flex items-center gap-6">
            {['Kebijakan Privasi', 'Ketentuan Layanan', 'Standar Metodologi'].map(l => (
              <span key={l} className="hover:text-[#0b1c30] cursor-pointer transition-colors">{l}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
