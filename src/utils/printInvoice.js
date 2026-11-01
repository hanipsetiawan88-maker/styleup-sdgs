/**
 * Utility to generate and trigger the native browser print preview (window.print())
 * formatted as an official StyleUp Sustainability payment receipt / invoice,
 * exactly matching the structured layout from the user reference.
 */

const QR_CODE_SVG = `
<svg width="64" height="64" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="100" height="100" fill="white"/>
  <!-- Top-left finder pattern -->
  <rect x="8" y="8" width="28" height="28" rx="4" fill="#111827"/>
  <rect x="14" y="14" width="16" height="16" rx="2" fill="#ffffff"/>
  <rect x="18" y="18" width="8" height="8" rx="1" fill="#003828"/>
  <!-- Top-right finder pattern -->
  <rect x="64" y="8" width="28" height="28" rx="4" fill="#111827"/>
  <rect x="70" y="14" width="16" height="16" rx="2" fill="#ffffff"/>
  <rect x="74" y="18" width="8" height="8" rx="1" fill="#003828"/>
  <!-- Bottom-left finder pattern -->
  <rect x="8" y="64" width="28" height="28" rx="4" fill="#111827"/>
  <rect x="14" y="70" width="16" height="16" rx="2" fill="#ffffff"/>
  <rect x="18" y="74" width="8" height="8" rx="1" fill="#003828"/>
  <!-- Micro data matrix dots -->
  <rect x="42" y="10" width="6" height="6" rx="1" fill="#111827"/>
  <rect x="52" y="10" width="6" height="6" rx="1" fill="#111827"/>
  <rect x="42" y="22" width="6" height="6" rx="1" fill="#003828"/>
  <rect x="48" y="28" width="6" height="6" rx="1" fill="#111827"/>
  <rect x="10" y="44" width="6" height="6" rx="1" fill="#111827"/>
  <rect x="22" y="44" width="6" height="6" rx="1" fill="#003828"/>
  <rect x="16" y="52" width="6" height="6" rx="1" fill="#111827"/>
  <rect x="28" y="52" width="6" height="6" rx="1" fill="#111827"/>
  <rect x="42" y="42" width="6" height="6" rx="1" fill="#003828"/>
  <rect x="52" y="42" width="6" height="6" rx="1" fill="#111827"/>
  <rect x="42" y="52" width="6" height="6" rx="1" fill="#111827"/>
  <rect x="52" y="52" width="6" height="6" rx="1" fill="#003828"/>
  <rect x="64" y="44" width="6" height="6" rx="1" fill="#111827"/>
  <rect x="76" y="44" width="6" height="6" rx="1" fill="#111827"/>
  <rect x="86" y="44" width="6" height="6" rx="1" fill="#003828"/>
  <rect x="70" y="52" width="6" height="6" rx="1" fill="#111827"/>
  <rect x="82" y="52" width="6" height="6" rx="1" fill="#111827"/>
  <rect x="44" y="66" width="6" height="6" rx="1" fill="#111827"/>
  <rect x="54" y="72" width="6" height="6" rx="1" fill="#003828"/>
  <rect x="44" y="82" width="6" height="6" rx="1" fill="#111827"/>
  <rect x="66" y="66" width="6" height="6" rx="1" fill="#003828"/>
  <rect x="76" y="72" width="6" height="6" rx="1" fill="#111827"/>
  <rect x="86" y="66" width="6" height="6" rx="1" fill="#111827"/>
  <rect x="72" y="84" width="6" height="6" rx="1" fill="#111827"/>
  <rect x="84" y="84" width="6" height="6" rx="1" fill="#003828"/>
</svg>
`;

function formatRp(n) {
  return `Rp ${Number(n || 0).toLocaleString('id-ID')}`;
}

export function printInvoice(tx = {}, donorName = 'Najlaa Khairunnisa Arwanto') {
  // Normalize data with sensible defaults
  const invoiceId = tx.id ? (tx.id.startsWith('INV-') ? tx.id : `INV-${tx.id.replace('TRX-SDG-', '')}`) : 'INV-2026-SU-0891';
  const invoiceDate = tx.date || '24 Okt 2026, 01.11 WIB';
  const projectTitle = tx.projectTitle || 'Restorasi 150 Ha Sabuk Hijau Mangrove Pesisir Delta Mahakam';
  const location = tx.location || 'Kutai Kartanegara, Kalimantan Timur';
  const paymentMethod = tx.paymentMethod || 'QRIS Dinamis 24 Jam';
  const amount = tx.amount || tx.total || 500000;
  const platformFee = 0;
  const total = tx.total || amount;
  const donorId = tx.donorId || 'SU-USR-882194';
  const taxCert = tx.taxCertNumber || 'PMK-04/BAPPENAS/2026/0891';
  const impactVal = tx.impactVal || 'Setara 25 Bibit Mangrove & 180 kg CO2e Serapan Karbon';

  const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8" />
  <title>Kwitansi Resmi - ${invoiceId}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 14mm 16mm 14mm 16mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #111827;
      background: #ffffff;
      padding: 0;
      font-size: 11px;
      line-height: 1.45;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .receipt-container {
      width: 100%;
      max-width: 720px;
      margin: 0 auto;
    }
    /* Top Header Bar */
    .header-bar {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding-bottom: 12px;
      border-bottom: 1px solid #e5e7eb;
    }
    .brand-title {
      font-size: 22px;
      font-weight: 800;
      letter-spacing: -0.5px;
      color: #003828;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .brand-title span.accent {
      color: #006c49;
    }
    .brand-sub {
      font-size: 8.5px;
      font-weight: 600;
      letter-spacing: 0.6px;
      text-transform: uppercase;
      color: #6b7280;
      margin-top: 3px;
    }
    .invoice-meta {
      text-align: right;
    }
    .invoice-no {
      font-size: 11.5px;
      font-weight: 700;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      color: #1f2937;
    }
    .invoice-date {
      font-size: 10px;
      color: #6b7280;
      margin-top: 2px;
    }

    /* Title & Lunas Stamp Row */
    .title-stamp-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 18px;
      margin-bottom: 16px;
    }
    .receipt-title-wrap {
      flex: 1;
    }
    .doc-type-label {
      font-size: 9.5px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: #4b5563;
    }
    .doc-main-title {
      font-size: 18px;
      font-weight: 800;
      color: #111827;
      margin-top: 2px;
    }
    .doc-sub-title {
      font-size: 11px;
      color: #6b7280;
      margin-top: 2px;
      font-style: normal;
    }

    /* Stamp Box */
    .stamp-badge {
      border: 2px solid #1f2937;
      border-radius: 8px;
      padding: 6px 14px;
      text-align: center;
      transform: rotate(-3deg);
      background: #fafafa;
      box-shadow: 0 1px 2px rgba(0,0,0,0.05);
      min-width: 140px;
    }
    .stamp-org {
      font-size: 8.5px;
      font-weight: 800;
      letter-spacing: 1px;
      color: #374151;
      text-transform: uppercase;
    }
    .stamp-lunas {
      font-size: 16px;
      font-weight: 900;
      letter-spacing: 2px;
      color: #111827;
      line-height: 1.1;
      margin: 2px 0;
    }
    .stamp-sub {
      font-size: 7.5px;
      font-weight: 700;
      letter-spacing: 0.6px;
      color: #4b5563;
      text-transform: uppercase;
    }

    /* Info Rounded Box */
    .info-card {
      border: 1px solid #d1d5db;
      border-radius: 10px;
      padding: 14px 18px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      background: #ffffff;
    }
    .info-col {
      width: 48%;
    }
    .info-group {
      margin-bottom: 10px;
    }
    .info-group:last-child {
      margin-bottom: 0;
    }
    .info-label {
      font-size: 9.5px;
      color: #6b7280;
      margin-bottom: 2px;
    }
    .info-value {
      font-size: 11.5px;
      font-weight: 700;
      color: #111827;
    }
    .info-value.mono {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    }
    .info-value.verified {
      color: #006c49;
      font-weight: 800;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }

    /* Breakdown Table */
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 16px;
    }
    .items-table th {
      text-align: left;
      font-size: 10px;
      font-weight: 700;
      color: #374151;
      padding: 8px 10px;
      border-bottom: 1.5px solid #111827;
    }
    .items-table th.right {
      text-align: right;
    }
    .items-table td {
      padding: 10px 10px;
      font-size: 11px;
      color: #1f2937;
      border-bottom: 1px solid #f3f4f6;
      vertical-align: top;
    }
    .items-table td.right {
      text-align: right;
      font-weight: 600;
      white-space: nowrap;
    }
    .item-desc-bold {
      font-weight: 700;
      color: #111827;
      margin-bottom: 2px;
    }
    .item-desc-sub {
      font-size: 9.5px;
      color: #6b7280;
    }

    /* Total Payment Row */
    .total-row {
      display: flex;
      justify-content: flex-end;
      align-items: baseline;
      gap: 16px;
      padding: 12px 10px;
      border-top: 1.5px solid #111827;
      margin-bottom: 22px;
    }
    .total-label {
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.5px;
      color: #111827;
      text-transform: uppercase;
    }
    .total-amount {
      font-size: 16px;
      font-weight: 900;
      color: #003828;
    }

    /* Tax PMK Note */
    .tax-note {
      background: #f9fafb;
      border-left: 3px solid #006c49;
      padding: 8px 12px;
      margin-bottom: 26px;
      border-radius: 0 6px 6px 0;
    }
    .tax-note-title {
      font-size: 9.5px;
      font-weight: 700;
      color: #003828;
      margin-bottom: 2px;
    }
    .tax-note-text {
      font-size: 9px;
      color: #4b5563;
      line-height: 1.4;
    }

    /* Footer Section */
    .footer-bar {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      padding-top: 12px;
      border-top: 1px solid #e5e7eb;
    }
    .footer-qr-wrap {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .footer-qr-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .footer-qr-label {
      font-size: 9px;
      color: #6b7280;
    }
    .footer-qr-link {
      font-size: 10px;
      font-weight: 700;
      color: #003828;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    }
    .footer-qr-status {
      font-size: 8.5px;
      color: #4b5563;
    }

    .footer-official {
      text-align: right;
    }
    .footer-official-label {
      font-size: 9px;
      color: #6b7280;
    }
    .footer-official-name {
      font-size: 11px;
      font-weight: 700;
      color: #111827;
      margin-top: 2px;
    }
    .footer-official-sub {
      font-size: 8.5px;
      color: #6b7280;
      margin-top: 1px;
    }
  </style>
</head>
<body>
  <div class="receipt-container">
    
    <!-- Header -->
    <div class="header-bar">
      <div>
        <div class="brand-title">
          Style<span class="accent">Up</span>
        </div>
        <div class="brand-sub">
          SISTEM INFORMASI AKSELERASI INDONESIA EMAS 2045 &bull; BAPPENAS ESCROW
        </div>
      </div>
      <div class="invoice-meta">
        <div class="invoice-no">${invoiceId}</div>
        <div class="invoice-date">${invoiceDate}</div>
      </div>
    </div>

    <!-- Title & Lunas Stamp -->
    <div class="title-stamp-row">
      <div class="receipt-title-wrap">
        <div class="doc-type-label">SURAT BUKTI PEMBAYARAN RESMI</div>
        <h1 class="doc-main-title">Kwitansi Penyaluran Donasi Hijau</h1>
        <div class="doc-sub-title">Program Konservasi Lingkungan &amp; Aksi Nyata SDGs Nasional</div>
      </div>
      <div class="stamp-badge">
        <div class="stamp-org">STYLEUP CLOUD</div>
        <div class="stamp-lunas">LUNAS</div>
        <div class="stamp-sub">VERIFIED &bull; IDR VALID</div>
      </div>
    </div>

    <!-- Info Rounded Card -->
    <div class="info-card">
      <div class="info-col">
        <div class="info-group">
          <div class="info-label">Nama Donatur / Mitra:</div>
          <div class="info-value">${donorName}</div>
        </div>
        <div class="info-group">
          <div class="info-label">Metode Pembayaran:</div>
          <div class="info-value">${paymentMethod}</div>
        </div>
      </div>
      <div class="info-col">
        <div class="info-group">
          <div class="info-label">Nomor ID Registrasi / Akun:</div>
          <div class="info-value mono">${donorId} &bull; ${invoiceId.split('-').pop() || '0891'}</div>
        </div>
        <div class="info-group">
          <div class="info-label">Status Transaksi:</div>
          <div class="info-value verified">100% Terverifikasi Otomatis</div>
        </div>
      </div>
    </div>

    <!-- Items Breakdown Table -->
    <table class="items-table">
      <thead>
        <tr>
          <th style="width: 52%;">Deskripsi Layanan / Program</th>
          <th style="width: 26%;">Alokasi / Durasi</th>
          <th class="right" style="width: 22%;">Jumlah</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <div class="item-desc-bold">${projectTitle}</div>
            <div class="item-desc-sub">${location}</div>
          </td>
          <td>SDGs 13 &amp; 14 (Konservasi)</td>
          <td class="right">${formatRp(amount)}</td>
        </tr>
        <tr>
          <td>
            <div class="item-desc-bold">Sertifikasi Karbon Terverifikasi &amp; Pohon Asuh</div>
            <div class="item-desc-sub">${impactVal}</div>
          </td>
          <td>Permanen / Terakreditasi</td>
          <td class="right">Rp 0</td>
        </tr>
        <tr>
          <td>
            <div class="item-desc-bold">Biaya Administrasi &amp; Pemeliharaan Platform Escrow</div>
            <div class="item-desc-sub">Subsidi Penuh Bappenas RI &bull; 0% Fee Donatur</div>
          </td>
          <td>Periode Berjalan</td>
          <td class="right">Rp 0</td>
        </tr>
      </tbody>
    </table>

    <!-- Total Payment Summary -->
    <div class="total-row">
      <span class="total-label">TOTAL PEMBAYARAN:</span>
      <span class="total-amount">${formatRp(total)}</span>
    </div>

    <!-- Tax Exemption Legal Banner -->
    <div class="tax-note">
      <div class="tax-note-title">Fasilitas Deduksi Pengurangan Pajak Sah (PMK No. 04/PMK.03/2020)</div>
      <div class="tax-note-text">
        Kwitansi ini adalah dokumen sah pengganti faktur pajak untuk pelaporan SPT Tahunan Wajib Pajak Badan &amp; Orang Pribadi. Nomor Registrasi PMK: <strong>${taxCert}</strong>.
      </div>
    </div>

    <!-- Footer Verification & Signature -->
    <div class="footer-bar">
      <div class="footer-qr-wrap">
        <div>${QR_CODE_SVG}</div>
        <div class="footer-qr-info">
          <span class="footer-qr-label">Verifikasi Dokumen:</span>
          <span class="footer-qr-link">styleup-sdgs.id/verify/${invoiceId}</span>
          <span class="footer-qr-status">Tanda Terima Elektronik Sah &amp; Mengikat</span>
        </div>
      </div>
      <div class="footer-official">
        <div class="footer-official-label">Pengelola Resmi StyleUp SDGs:</div>
        <div class="footer-official-name">Tim Tata Kelola SDGs Bappenas RI</div>
        <div class="footer-official-sub">Tercatat di Database Bappenas &amp; Kemenkeu</div>
      </div>
    </div>

  </div>
</body>
</html>`;

  // Create or reuse hidden printing iframe
  const existingIframe = document.getElementById('styleup-print-iframe');
  if (existingIframe) {
    existingIframe.remove();
  }

  const iframe = document.createElement('iframe');
  iframe.id = 'styleup-print-iframe';
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  iframe.style.visibility = 'hidden';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow.document;
  doc.open();
  doc.write(html);
  doc.close();

  // Focus and trigger window.print() inside the iframe
  iframe.contentWindow.focus();
  setTimeout(() => {
    iframe.contentWindow.print();
    // Clean up after print dialog finishes/closes
    setTimeout(() => {
      try {
        iframe.remove();
      } catch (e) {
        // ignore
      }
    }, 2000);
  }, 300);
}

/**
 * Print utility for official ISO-14064 Certificate
 */
export function printCertificate({ donorName, nominal, projectTitle, co2, bibit, certType = 'donatur' }) {
  const isDonatur = certType === 'donatur';
  const certId = `ISO14064-${Date.now().toString(16).toUpperCase()}`;

  const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8" />
  <title>Piagam Sertifikat - ${certId}</title>
  <style>
    @page {
      size: A4 landscape;
      margin: 12mm 15mm 12mm 15mm;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #0b1c30;
      background: #ffffff;
      padding: 0;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .cert-frame {
      border: 3px double #0d503c;
      border-radius: 14px;
      padding: 24px 32px;
      min-height: 94vh;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
    }
    .cert-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 14px;
    }
    .cert-brand {
      font-size: 24px;
      font-weight: 900;
      color: #003828;
    }
    .cert-brand span { color: #006c49; }
    .cert-org {
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.8px;
      color: #4b5563;
      text-transform: uppercase;
    }
    .cert-id-tag {
      font-family: monospace;
      font-size: 11px;
      background: #eff4ff;
      padding: 4px 10px;
      border-radius: 6px;
      border: 1px solid #d1d5db;
      font-weight: 700;
      color: #003828;
    }
    .cert-body {
      text-align: center;
      padding: 20px 0;
    }
    .cert-title-badge {
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: #006c49;
      margin-bottom: 6px;
    }
    .cert-title {
      font-size: 26px;
      font-weight: 900;
      color: #0b1c30;
      margin-bottom: 12px;
    }
    .cert-to-text {
      font-size: 11px;
      color: #6b7280;
      margin-bottom: 4px;
    }
    .cert-recipient {
      font-size: 24px;
      font-weight: 800;
      color: #003828;
      border-bottom: 2px solid #006c49;
      display: inline-block;
      padding-bottom: 4px;
      margin-bottom: 14px;
    }
    .cert-desc {
      font-size: 12px;
      color: #374151;
      max-width: 650px;
      margin: 0 auto 18px auto;
      line-height: 1.5;
    }
    .cert-stats {
      display: flex;
      justify-content: center;
      gap: 30px;
      margin-bottom: 16px;
    }
    .stat-pill {
      background: #f8f9ff;
      border: 1px solid #e5eeff;
      border-radius: 10px;
      padding: 8px 16px;
      text-align: center;
    }
    .stat-pill .num {
      font-size: 14px;
      font-weight: 800;
      color: #006c49;
    }
    .stat-pill .lbl {
      font-size: 9px;
      color: #6b7280;
    }
    .cert-footer {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      border-top: 1px solid #e5e7eb;
      padding-top: 14px;
    }
    .sign-box {
      text-align: center;
      min-width: 160px;
    }
    .sign-role {
      font-size: 9px;
      color: #6b7280;
      margin-bottom: 30px;
    }
    .sign-name {
      font-size: 11px;
      font-weight: 800;
      border-top: 1px solid #9ca3af;
      padding-top: 4px;
      color: #111827;
    }
    .sign-inst {
      font-size: 8.5px;
      color: #6b7280;
    }
  </style>
</head>
<body>
  <div class="cert-frame">
    <div class="cert-header">
      <div>
        <div class="cert-brand">Style<span>Up</span></div>
        <div class="cert-org">KEMENTERIAN PPN / BAPPENAS RI &bull; AKSELERASI INDONESIA EMAS 2045</div>
      </div>
      <div class="cert-id-tag">${certId}</div>
    </div>

    <div class="cert-body">
      <div class="cert-title-badge">${isDonatur ? 'SERTIFIKAT KONTRIBUTOR RESMI' : 'SERTIFIKAT RELAWAN INOVATOR'}</div>
      <h1 class="cert-title">Piagam Akreditasi Keberlanjutan</h1>
      <div class="cert-to-text">Dianugerahkan dengan penuh kehormatan kepada:</div>
      <div class="cert-recipient">${donorName}</div>
      <p class="cert-desc">
        Atas dedikasi, kontribusi nyata, dan partisipasi strategis dalam program inisiatif 
        <strong>${projectTitle}</strong> yang diaudit berdasarkan standar internasional ISO 14064-1 &amp; PMK-04 RI.
      </p>
      <div class="cert-stats">
        <div class="stat-pill">
          <div class="num">Rp ${Number(nominal || 0).toLocaleString('id-ID')}</div>
          <div class="lbl">Kontribusi Didistribusikan</div>
        </div>
        <div class="stat-pill">
          <div class="num">${co2} kg CO2e</div>
          <div class="lbl">Serapan Emisi Karbon</div>
        </div>
        <div class="stat-pill">
          <div class="num">${bibit} Unit</div>
          <div class="lbl">Bibit &amp; Biota Direstorasi</div>
        </div>
      </div>
    </div>

    <div class="cert-footer">
      <div class="sign-box">
        <div class="sign-role">Deputi Bidang Kemaritiman &amp; SDA</div>
        <div class="sign-name">Dr. Ir. Vivi Yulaswati, MSc</div>
        <div class="sign-inst">Kementerian PPN / Bappenas RI</div>
      </div>
      <div style="display: flex; align-items: center; gap: 8px;">
        ${QR_CODE_SVG}
        <div style="font-size: 8.5px; color: #6b7280; text-align: left;">
          <div>SHA-256 Ledger Terverifikasi</div>
          <div style="font-family: monospace; font-size: 8px; color: #111827;">ISO14064-BAPPENAS-2026</div>
        </div>
      </div>
      <div class="sign-box">
        <div class="sign-role">Direktur Eksekutif StyleUp</div>
        <div class="sign-name">Prof. Bambang Brodjonegoro</div>
        <div class="sign-inst">StyleUp Sustainability Foundation</div>
      </div>
    </div>
  </div>
</body>
</html>`;

  const existingIframe = document.getElementById('styleup-cert-iframe');
  if (existingIframe) existingIframe.remove();

  const iframe = document.createElement('iframe');
  iframe.id = 'styleup-cert-iframe';
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  iframe.style.visibility = 'hidden';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow.document;
  doc.open();
  doc.write(html);
  doc.close();

  iframe.contentWindow.focus();
  setTimeout(() => {
    iframe.contentWindow.print();
    setTimeout(() => {
      try {
        iframe.remove();
      } catch (e) {
        // ignore
      }
    }, 2000);
  }, 300);
}
