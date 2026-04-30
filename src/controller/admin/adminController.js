const db = require('../../../db'); 
const getContract = require('../../config/blockchain/blockchain');
const ADMIN_WALLET = process.env.ADMIN_WALLET

const productController = {

    getAllUser: async (req, res) => {
        try {
            const [rows] = await db.query('SELECT * FROM users ORDER BY id ASC');

            res.render('admin/userManager', { 
                users: rows 
            });

        } catch (error) {
            console.error("Lỗi lấy dữ liệu:", error);
            res.status(500).send("Lỗi hệ thống");
        }
    },

    editUser: async (req, res) => {
        try {
            const { id } = req.params; 
            const { display_name, phone, address, role } = req.body;

            const query = `
                UPDATE users 
                SET display_name = ?, 
                    phone = ?, 
                    address = ?, 
                    role = ? 
                WHERE id = ?
            `;

            const values = [display_name, phone, address, role, id];

            const [result] = await db.query(query, values);

            if (result.affectedRows > 0) {
                console.log('thanh cong!')
                res.redirect('/admin/users');
            } else {
                console.log('that bai!')
                res.status(404).render("error/error", {
                    status: 404,
                    message: "Không tìm thấy người dùng hoặc không có thay đổi nào.",
                    error: null
                });
            }

        } catch (error) {
            console.error("Lỗi khi cập nhật người dùng:", error);
            res.status(500).send("Lỗi hệ thống khi cập nhật dữ liệu.");
        }
    },

    deleteUser: async (req, res) => {
        try {
            const { id } = req.params;
            const { admin_code } = req.body;

            const MASTER_CODE = process.env.ADMIN_CODE; 
            if (admin_code !== MASTER_CODE) {
                return res.status(403).render('error/error', {
                    status: 403,
                    message: "Mã xác nhận Admin không chính xác!",
                    error: null
                });
            }

            const query = "DELETE FROM users WHERE id = ?";
            const [result] = await db.query(query, [id]);

            if (result.affectedRows > 0) {
                res.redirect('/admin/users');
            } else {
                return res.status(404).render('error/error', {
                    status: 404,
                    message: "Không tìm thấy người dùng để xóa.",
                    error: null
                });
            }

        } catch (error) {
            res.status(500).send("Lỗi hệ thống khi thực hiện xóa.");
            return res.status(500).render('error/error', {
                    status: 500,
                    message: "Lỗi hệ thống khi thực hiện xóa.",
                    error: null
                });
        }
    }
}

module.exports = productController