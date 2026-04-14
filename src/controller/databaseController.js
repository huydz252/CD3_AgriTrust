const db = require('../../db'); // Đi ngược ra 2 cấp để tìm file db.js

exports.getAllProducts = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM products');
        res.render('productList', { products: rows });
    } catch (error) {
        console.error("Lỗi lấy dữ liệu:", error);
        res.status(500).send("Lỗi Server MySQL");
    }
};