const  pool  = require("../../../db");

const cartController = {
    
    addToCart : async (req, res) => {
        const { productId } = req.body;
        const userId = req.user.id;

        try {
            //check sp da ton tai chua
            const [existing] = await pool.query(
                'SELECT * from cart WHERE user_id = ? AND product_id = ?', 
                [userId, productId]
            );
            
            if(existing.length == 0){
                await pool.query(
                    'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)',
                    [userId, productId, 1] 
                );
            }else{
                await pool.query(
                    'UPDATE cart SET quantity = quantity + 1 WHERE id = ?',
                    [existing[0].id]
                );
            }

            res.redirect('/api/products')
        } catch (error) {
            console.error("Gặp lỗi: ", error)
            res.status(500).send("Lỗi khi thêm sản phẩm vào giỏ")
        }
    }, 
    
    deleteFromCart: async (req, res) => {
        try {
            
        } catch (error) {
            
        }
    }
}
module.exports = cartController