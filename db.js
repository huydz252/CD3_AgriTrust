const mysql = require('mysql2')

// Tạo kết nối đến Docker MySQL
const pool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,      
    database: process.env.DATABASE,
    port: process.env.PORT,             
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool.promise();