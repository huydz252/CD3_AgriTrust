const  pool  = require("../../../db");
const authController = require('../../controller/auth/authController')

const cartController = {

    showCart : async (req, res) => {
            
        try {
            const userId = req.user.id
            const query = "SELECT cart.*, products.name, products.price, products.image_url FROM cart JOIN products ON cart.product_id = products.id WHERE cart.user_id = ?"
            const [cartItems] = await pool.query(query, [userId])
            //console.log("check cartItems: ", cartItems)
            res.render('user/cart', {cartItems})
        } catch (error) {
            console.error("gặp lỗi: ", error)
            res.status(500).send("Lỗi khi render giỏ hàng")
        }  
    },
    
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
        } catch (error) {
            console.error("Gặp lỗi: ", error)
            res.status(500).send("Lỗi khi thêm sản phẩm vào giỏ")
        }
    }, 
    
    updateQuantity: async (req, res) => {
        const { cart_id, quantity } = req.body;
        const user_id = req.user.id;
        try {
            await pool.query('UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?', 
                        [quantity, cart_id, user_id]);
            res.json({ success: true });
        } catch (error) {
            console.log("Lỗi: ",error)
            res.status(500).json({ success: false, message: error.message });
        }
    },

    removeProduct: async (req, res) => {
        const { cart_id } = req.body;
        const user_id = req.user.id;
        try {
            await pool.query('DELETE FROM cart WHERE id = ? AND user_id = ?', 
                        [cart_id, user_id]);
            res.json({ success: true });
        } catch (error) {
            console.log("Lỗi: " ,error)
            res.status(500).json({ success: false, message: error.message });
        }
    }

}
module.exports = cartController