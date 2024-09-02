require('dotenv').config();

const express = require('express');
const sql = require('mssql');

const app = express();
const port = process.env.PORT || 3000; // ใช้พอร์ตที่กำหนดโดยแพลตฟอร์มหรือ 3000 ถ้าไม่ได้กำหนด

// การตั้งค่าการเชื่อมต่อกับ SQL Server
const config = {
    user: process.env.DB_USER, // ใช้ตัวแปรแวดล้อมสำหรับ username
    password: process.env.DB_PASSWORD, // ใช้ตัวแปรแวดล้อมสำหรับ password
    server: process.env.DB_SERVER, // ที่อยู่ของ SQL Server จากตัวแปรแวดล้อม หรือค่าตั้งต้น
    database: process.env.DB_NAME,
    options: {
      encrypt: true, // ใช้การเข้ารหัสถ้าจำเป็น
      trustServerCertificate: true, // ใช้ถ้าไม่มีใบรับรอง SSL ที่เชื่อถือได้
    },
};

// สร้าง endpoint เพื่อดึงข้อมูลจากตาราง application
app.get('/applications', async (req, res) => {
  try {
    // เชื่อมต่อกับ SQL Server
    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT * FROM application');

    // ส่งข้อมูลที่ดึงได้ในรูปแบบ JSON
    res.json(result.recordset);
  } catch (err) {
    console.error('Error connecting to SQL Server:', err.message);
    res.status(500).send('Error connecting to SQL Server');
  } finally {
    sql.close(); // ปิดการเชื่อมต่อเมื่อทำงานเสร็จ
  }
});

// สร้าง endpoint เพื่อดึงข้อมูลจากตาราง calendar
app.get('/calendar', async (req, res) => {
  try {
    // เชื่อมต่อกับ SQL Server
    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT * FROM calendar');

    // ส่งข้อมูลที่ดึงได้ในรูปแบบ JSON
    res.json(result.recordset);
  } catch (err) {
    console.error('Error connecting to SQL Server:', err.message);
    res.status(500).send('Error connecting to SQL Server');
  } finally {
    sql.close(); // ปิดการเชื่อมต่อเมื่อทำงานเสร็จ
  }
});

// เพิ่ม endpoint สำหรับ root URL
app.get('/', (req, res) => {
  res.send('Hello! This is the root of your API.');
});

// เพิ่มการจัดการข้อผิดพลาด
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// เริ่มต้นเซิร์ฟเวอร์
app.listen(port, () => {
  console.log(`API server running at http://localhost:${port}`);
});
