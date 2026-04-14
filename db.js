const mysql = require('mysql2')

// Tạo kết nối đến Docker MySQL
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'admin',      
    database: 'agritrust',
    port: 3306,             
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool.promise();