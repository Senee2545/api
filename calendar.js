const express = require('express');
const sql = require('mssql');

const app = express();
const port = 3000;

// การตั้งค่าการเชื่อมต่อกับ SQL Server
const config = {
  user: 'ai',
  password: 'Toa@2024',
  server: '52.76.126.117', // ที่อยู่ของ SQL Server
  database: 'intranet_db',
  options: {
    encrypt: true, // ใช้การเข้ารหัสถ้าจำเป็น
    trustServerCertificate: true, // ใช้ถ้าไม่มีใบรับรอง SSL ที่เชื่อถือได้
  },
};

// สร้าง endpoint เพื่อดึงข้อมูลจากตาราง application
app.get('/calendar', async (req, res) => {
  try {
    // เชื่อมต่อกับ SQL Server
    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT * FROM calendar');

    // ส่งข้อมูลที่ดึงได้ในรูปแบบ JSON
    res.json(result.recordset);

    // ปิดการเชื่อมต่อเมื่อทำงานเสร็จ
    await pool.close();
  } catch (err) {
    console.error('Error connecting to SQL Server:', err.message);
    res.status(500).send('Error connecting to SQL Server');
  }
});

// เพิ่ม endpoint สำหรับ root URL
app.get('/', (req, res) => {
  res.send('Hello! This is the root of your API.');
});

// เริ่มต้นเซิร์ฟเวอร์
app.listen(port, () => {
  console.log(`API server running at http://localhost:${port}`);
});
