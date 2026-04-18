const db = require('../../db.js')

const generateOrderCode = async () => {
    let isUnique = false;
    let newCode = '';

    while (!isUnique) {
        const now = new Date();
        const datePart = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate()}`;
        const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
        newCode = `AT${datePart}${randomPart}`;

        // Kiểm tra xem mã này đã tồn tại trong DB chưa
        const [rows] = await db.execute('SELECT id FROM orders WHERE order_code = ?', [newCode]);
        if (rows.length === 0) {
            isUnique = true;
        }
    }
    return newCode;
};

module.exports = {
    generateOrderCode
};