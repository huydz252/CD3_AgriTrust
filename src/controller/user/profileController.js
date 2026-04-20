const  pool  = require("../../../db");

const profileController = {

    getProfile: async (req, res) => {
        const user_id = req.user.id;
        const query = "SELECT * FROM users WHERE id = ?"
        try {
            const [user] = await pool.query(query, [user_id])
            if(user.length == 0) {
                res.status(404).send('Không tìm thấy người dùng!!')
            }
            // console.log("check: ", user)
            res.render('user/profile', {user: user[0]})
        } catch (error) {
            console.error("Lỗi: ", error);
            res.status(500).send('Lỗi khi truy cập profile!')
        }
    },

    updateProfile: async (req, res) => {
        const user_id = req.user.id;
        const {display_name, phone, address} = req.body
        const query = "UPDATE users SET display_name = ?, phone = ?, address = ? WHERE id = ?"
        try {
            const [user] = await pool.query(query, [display_name, phone, address, user_id])
            if(user.length == 0) {
                res.status(404).send('Không tìm thấy người dùng!!')
            }
            console.log("check: ", user)
            res.redirect('/user/profile')
        } catch (error) {
            console.error("Lỗi: ", error);
            res.status(500).send('Lỗi khi truy cập profile!')
        }
    },

    updateWallet: async (req, res) => {
        const { walletAddress } = req.body;
        const userId = req.user.id;

        //check luôn id để tránh trường hợp bị kẹt, k thể truy cập vào ví của chính mình (hiếm)
        const checkExistingUser = 'SELECT * FROM users WHERE wallet_address = ? AND id != ?' 
        const updateWalletAddress = 'UPDATE users SET wallet_address = ? WHERE id = ?'
        try {
            const [existingUser] = await pool.query(checkExistingUser, [walletAddress, userId])
            if(existingUser.length > 0){
                return res.status(400).json({
                    success: false,
                    message: 'Địa chỉ ví này đã được liên kết với một tài khoản khác!'
                })
            }else{
                await pool.query(updateWalletAddress, [walletAddress, userId]);
            }
            
            res.json({ success: true, message: 'Thêm ví thành công!' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}
module.exports = profileController