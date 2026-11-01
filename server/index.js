import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

let pool = null;
let isConnecting = false;

// Robust Auto-Reconnection Helper
async function getDbPool() {
  if (pool) return pool;
  if (isConnecting) {
    await new Promise((r) => setTimeout(r, 600));
    if (pool) return pool;
  }
  isConnecting = true;
  try {
    pool = await initializeDatabase();
    console.log('✅ MySQL Database XAMPP connected & ready.');
    return pool;
  } catch (err) {
    console.warn('📡 Menunggu MySQL XAMPP aktif di Port 3306:', err.message);
    return null;
  } finally {
    isConnecting = false;
  }
}

// Background reconnect loop every 3 seconds if not connected
async function autoConnectLoop() {
  if (!pool) {
    await getDbPool();
  }
  if (!pool) {
    setTimeout(autoConnectLoop, 3000);
  }
}
autoConnectLoop();

// Health check endpoint
app.get('/api/health', async (req, res) => {
  const activePool = await getDbPool();
  res.json({
    status: 'ok',
    database: activePool ? 'connected' : 'connecting',
    mysql: 'XAMPP 3306',
    timestamp: new Date().toISOString()
  });
});

// 1. AUTH: LOGIN
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email wajib diisi' });
    }

    const activePool = await getDbPool();
    if (!activePool) {
      return res.status(503).json({
        success: false,
        message: 'Koneksi database MySQL XAMPP belum aktif. Pastikan tombol MySQL di XAMPP Control Panel sudah Start.'
      });
    }

    const [rows] = await activePool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Email atau kata sandi tidak ditemukan di database' });
    }

    const user = rows[0];
    if (password && user.password !== password) {
      return res.status(401).json({ success: false, message: 'Kata sandi tidak sesuai' });
    }

    // Success login
    res.json({
      success: true,
      message: 'Login berhasil',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        totalDonasi: `Rp ${new Intl.NumberFormat('id-ID').format(user.total_donasi)}`,
        totalJamRelawan: user.total_jam_relawan,
        esgScore: user.esg_score,
        verified: true,
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// 2. AUTH: REGISTER
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role = 'Relawan Aktif', phone = '' } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Nama, email, dan kata sandi wajib diisi' });
    }

    const activePool = await getDbPool();
    if (!activePool) {
      return res.status(503).json({
        success: false,
        message: 'Database belum terhubung. Pastikan tombol MySQL di XAMPP sudah Start.'
      });
    }

    const [existing] = await activePool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Email sudah terdaftar, silakan gunakan email lain atau langsung masuk' });
    }

    const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;
    const [result] = await activePool.query(
      `INSERT INTO users (name, email, password, role, phone, avatar, total_donasi, total_jam_relawan, esg_score)
       VALUES (?, ?, ?, ?, ?, ?, 0, 0, 800)`,
      [name, email, password, role, phone, avatar]
    );

    res.json({
      success: true,
      message: 'Registrasi berhasil tersimpan di MySQL',
      user: {
        id: result.insertId,
        name,
        email,
        role,
        phone,
        avatar,
        totalDonasi: 'Rp 0',
        totalJamRelawan: 0,
        esgScore: 800,
        verified: true,
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// 3. TRANSAKSI DONASI: SUBMIT DONATION
app.post('/api/donations', async (req, res) => {
  try {
    const {
      userId,
      projectId,
      projectTitle,
      donorName,
      donorEmail,
      donorPhone,
      amount,
      paymentMethod,
      impactVal,
    } = req.body;

    if (!amount || !projectId) {
      return res.status(400).json({ success: false, message: 'Data donasi tidak lengkap' });
    }

    const activePool = await getDbPool();
    if (!activePool) {
      return res.status(503).json({ success: false, message: 'Database belum terhubung' });
    }

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const trxId = `TRX-SDG-${new Date().getFullYear()}-${randomNum}`;
    const taxCert = `PMK-04/BAPPENAS/${new Date().getFullYear()}/${randomNum}`;

    await activePool.query(
      `INSERT INTO donations 
       (trx_id, user_id, project_id, project_title, donor_name, donor_email, donor_phone, amount, payment_method, status, tax_cert_number, impact_val)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Berhasil', ?, ?)`,
      [
        trxId,
        userId || null,
        projectId,
        projectTitle || 'Proyek SDGs',
        donorName || 'Anonim',
        donorEmail || '',
        donorPhone || '',
        amount,
        paymentMethod || 'QRIS',
        taxCert,
        impactVal || 'Kontribusi Dukungan Berkelanjutan'
      ]
    );

    // Update user's total donation in MySQL if userId provided
    if (userId) {
      await activePool.query(
        'UPDATE users SET total_donasi = total_donasi + ? WHERE id = ?',
        [amount, userId]
      );
    }

    res.json({
      success: true,
      message: 'Donasi berhasil dicatat ke MySQL XAMPP',
      donation: {
        trxId,
        amount,
        taxCertNumber: taxCert,
        status: 'Berhasil'
      }
    });
  } catch (error) {
    console.error('Donation error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// 4. TRANSAKSI DONASI: GET HISTORY
app.get('/api/donations', async (req, res) => {
  try {
    const activePool = await getDbPool();
    if (!activePool) {
      return res.status(503).json({ success: false, message: 'Database belum siap' });
    }

    const { email } = req.query;
    let query = 'SELECT * FROM donations ORDER BY created_at DESC';
    let params = [];

    if (email) {
      query = 'SELECT * FROM donations WHERE donor_email = ? ORDER BY created_at DESC';
      params = [email];
    }

    const [rows] = await activePool.query(query, params);

    // Format for frontend
    const formatted = rows.map((r) => {
      const dt = new Date(r.created_at);
      const dateStr = dt.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }) + ' WIB';

      return {
        id: r.trx_id,
        date: dateStr,
        projectTitle: r.project_title,
        location: 'Indonesia',
        sdgs: [
          { num: 13, label: 'Aksi Iklim', color: '#3F7E44' },
          { num: 14, label: 'Ekosistem Laut', color: '#0A97D9' }
        ],
        amount: Number(r.amount) || 0,
        platformFee: 0,
        total: Number(r.amount) || 0,
        paymentMethod: r.payment_method || 'QRIS',
        status: r.status || 'Berhasil',
        taxEligible: true,
        taxCertNumber: r.tax_cert_number || `PMK-04/BAPPENAS/2026/${r.id || 1000}`,
        impactVal: r.impact_val || 'Kontribusi Ekologis',
      };
    });

    res.json({ success: true, donations: formatted });
  } catch (error) {
    console.error('Get donations error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 API Server StyleUp berjalan di: http://localhost:${PORT}`);
  console.log(`📡 Terhubung ke MySQL XAMPP Port 3306 (database: styleup_sdgs)`);
});
