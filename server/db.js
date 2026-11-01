import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'styleup_sdgs';
const DB_PORT = process.env.DB_PORT || 3306;

// Function to auto-create database & tables if they don't exist
export async function initializeDatabase() {
  try {
    // 1. Connect without selecting database first
    const rootConn = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      port: DB_PORT,
    });

    await rootConn.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await rootConn.end();

    // 2. Connect to the styleup_sdgs database
    const pool = mysql.createPool({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      port: DB_PORT,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    // Create Tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(120) NOT NULL,
        email VARCHAR(120) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'Relawan Aktif',
        phone VARCHAR(30) DEFAULT '',
        avatar VARCHAR(255) DEFAULT '',
        total_donasi BIGINT DEFAULT 0,
        total_jam_relawan INT DEFAULT 0,
        esg_score INT DEFAULT 850,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        location VARCHAR(150) NOT NULL,
        sdgs_json TEXT NOT NULL,
        verified VARCHAR(100) DEFAULT 'Terverifikasi Bappenas RI',
        collected BIGINT DEFAULT 0,
        target BIGINT NOT NULL,
        volunteers VARCHAR(50) DEFAULT '0 / 50',
        days_left INT DEFAULT 30,
        urgent BOOLEAN DEFAULT FALSE,
        image TEXT,
        status VARCHAR(30) DEFAULT 'approved',
        score_sdgs INT DEFAULT 90,
        score_lokasi INT DEFAULT 85,
        score_anggaran INT DEFAULT 85,
        score_sumber_daya INT DEFAULT 80,
        score_keahlian INT DEFAULT 85,
        score_minat INT DEFAULT 80,
        total_skor DECIMAL(5,2) DEFAULT 85.50,
        tinjauan_tim TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);

    // Tambahkan kolom skoring ke tabel projects jika belum ada (Safe Migration)
    try {
      await pool.query(`ALTER TABLE projects ADD COLUMN status VARCHAR(30) DEFAULT 'approved'`);
    } catch (e) {}
    try {
      await pool.query(`ALTER TABLE projects ADD COLUMN score_sdgs INT DEFAULT 90`);
      await pool.query(`ALTER TABLE projects ADD COLUMN score_lokasi INT DEFAULT 85`);
      await pool.query(`ALTER TABLE projects ADD COLUMN score_anggaran INT DEFAULT 85`);
      await pool.query(`ALTER TABLE projects ADD COLUMN score_sumber_daya INT DEFAULT 80`);
      await pool.query(`ALTER TABLE projects ADD COLUMN score_keahlian INT DEFAULT 85`);
      await pool.query(`ALTER TABLE projects ADD COLUMN score_minat INT DEFAULT 80`);
      await pool.query(`ALTER TABLE projects ADD COLUMN total_skor DECIMAL(5,2) DEFAULT 85.50`);
      await pool.query(`ALTER TABLE projects ADD COLUMN tinjauan_tim TEXT`);
    } catch (e) {}

    await pool.query(`
      CREATE TABLE IF NOT EXISTS donations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        trx_id VARCHAR(50) UNIQUE NOT NULL,
        user_id INT NULL,
        project_id INT NOT NULL,
        project_title VARCHAR(255) NOT NULL,
        donor_name VARCHAR(120) NOT NULL,
        donor_email VARCHAR(120) NOT NULL,
        donor_phone VARCHAR(30) DEFAULT '',
        amount BIGINT NOT NULL,
        payment_method VARCHAR(50) NOT NULL,
        status VARCHAR(30) DEFAULT 'Berhasil',
        tax_cert_number VARCHAR(100),
        impact_val TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX (user_id),
        INDEX (project_id)
      ) ENGINE=InnoDB;
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS saved_projects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        project_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY user_project (user_id, project_id)
      ) ENGINE=InnoDB;
    `);

    // Check if default user exists, if not create Najlaa
    const [userRows] = await pool.query('SELECT * FROM users WHERE email = ?', ['najlaa.arwanto@esg-investama.id']);
    if (userRows.length === 0) {
      await pool.query(`
        INSERT INTO users (name, email, password, role, phone, avatar, total_donasi, total_jam_relawan, esg_score)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        'Najlaa Khairunnisa Arwanto',
        'najlaa.arwanto@esg-investama.id',
        '12345678',
        'Relawan & Kontributor',
        '+62 812-9842-1109',
        '/najlaa-profile.jpg',
        1500000,
        120,
        840
      ]);
      console.log('✅ Default user Najlaa created in MySQL');
    }

    // Check if default sample donations exist
    const [donRows] = await pool.query('SELECT COUNT(*) as count FROM donations');
    if (donRows[0].count === 0) {
      const defaultDonations = [
        [
          'TRX-SDG-2026-0891',
          1,
          1,
          'Restorasi 150 Ha Sabuk Hijau Mangrove Pesisir Delta Mahakam',
          'Najlaa Khairunnisa Arwanto',
          'najlaa.arwanto@esg-investama.id',
          '+62 812-9842-1109',
          500000,
          'QRIS - Bank Mandiri',
          'Berhasil',
          'PMK-04/BAPPENAS/2026/0891',
          'Setara 25 Bibit Mangrove & 180 kg CO2e Serapan Karbon'
        ],
        [
          'TRX-SDG-2026-0512',
          1,
          7,
          'Pelatihan Literasi Digital & Pemrograman Pemuda Banyuwangi',
          'Najlaa Khairunnisa Arwanto',
          'najlaa.arwanto@esg-investama.id',
          '+62 812-9842-1109',
          500000,
          'BCA Virtual Account',
          'Berhasil',
          'PMK-04/BAPPENAS/2026/0512',
          'Dukungan Fasilitas 2 Unit Tablet Belajar Komunal'
        ],
        [
          'TRX-SDG-2026-0104',
          1,
          4,
          'Restorasi Terumbu Karang Biorock Wakatobi',
          'Najlaa Khairunnisa Arwanto',
          'najlaa.arwanto@esg-investama.id',
          '+62 812-9842-1109',
          500000,
          'GoPay / QRIS Nasional',
          'Berhasil',
          'PMK-04/BAPPENAS/2026/0104',
          'Restorasi 1 Struktur Biorock & Monitoring Satelit GNSS'
        ]
      ];

      for (const d of defaultDonations) {
        await pool.query(`
          INSERT INTO donations (trx_id, user_id, project_id, project_title, donor_name, donor_email, donor_phone, amount, payment_method, status, tax_cert_number, impact_val)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, d);
      }
      console.log('✅ Default sample donations created in MySQL');
    }

    console.log(`✅ MySQL Database '${DB_NAME}' initialized & connected successfully.`);
    return pool;
  } catch (error) {
    console.error('❌ Failed to connect to MySQL:', error.message);
    throw error;
  }
}
