const  pool  = require("../../../db");
const authController = require('../../controller/auth/authController')
const getContract = require('../../config/blockchain/blockchain')
const orderServive = require('../../service/orderService')

const cartController = {

    showCart : async (req, res) => {
            
        try {
            const userId = req.user.id
            const query = "SELECT cart.*, products.name, products.price, products.image_url FROM cart JOIN products ON cart.product_id = products.id WHERE cart.user_id = ?"
            const [cartItems] = await pool.query(query, [userId])

            const bankConfig = {
                id: process.env.BANK_ID,
                account: process.env.BANK_ACCOUNT,
                template: process.env.BANK_TEMPLATE
            }

            res.render('user/cart', {
                userId,
                cartItems, 
                bankConfig
            })
        } catch (error) {
            console.error("gặp lỗi: ", error)
            res.status(500).render('error/error', {
                status: 500,
                message: 'Mất kết nối với Server!',
                error: null
            });
        }  
    },
    
    addToCart : async (req, res) => {
        const { productId } = req.body;
        const userId = req.user ? req.user.id : null;

        if (!userId) {
            return res.status(401).render('error/error', {
                status: 401,
                message: 'Gặp lỗi khi thêm sản phẩm, vui lòng thử lại sau',
                error: null
            });
        }
        
        //phòng khi người dùng F12 để xóa disabled của button
        const [rows] = await pool.query('SELECT blockchain_id FROM products WHERE id = ?', [productId]);
        if(rows.length == 0) {
            res.status(404).render('error/error', {
                status: 401,
                message: 'Không tìm thấy sản phẩm!',
                error: null
            });
        }
        const bcId = rows[0].blockchain_id;
        const contract = await getContract();
        const productDetails = await contract.getProductDetail(bcId);
        const currentStatus = Number(productDetails[3]);
        if(currentStatus !== 3){
            res.status(400).render('error/error', {
                status: 400,
                message: 'Sản phẩm chưa thể thêm vào giỏ',
                error: null
            })
        }

        try {
            //check stock trước:
            const stock = await pool.query('SELECT stock FROM products WHERE id = ?', [productId])
            if(Number(stock[0][0].stock) == 0){
                return res.json({ success: false, message: 'Sản phẩm này đã hết hàng!' });
            }

            //check xem đã có sp này trong cart chưa
            const [rows] = await pool.query(
                'SELECT id, quantity FROM cart WHERE user_id = ? AND product_id = ?', 
                [userId, productId]
            );
            
            //chưa thì thêm mới
            if (rows.length === 0) {
                await pool.query(
                    'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)',
                    [userId, productId, 1] 
                );
            
                //có rồi thì thêm quantity
            } else {
                await pool.query(
                    'UPDATE cart SET quantity = quantity + 1 WHERE id = ?',
                    [rows[0].id]
                );
            }

            return res.json({ success: true, message: 'Đã thêm vào giỏ hàng thành công!' });

        } catch (error) {
            console.error("Gặp lỗi tại addToCart: ", error);
            return res.status(500).render('error/error', {
                status: 500,
                message: 'Mất kết nối với Server!',
                error: null
            });
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
            res.status(500).render('error/error', {
                status: 500,
                message: 'Mất kết nối với Server!',
                error: null
            });
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
            res.status(500).render('error/error', {
                status: 500,
                message: 'Mất kết nối với Server!',
                error: null
            });
        }
    },

    getOrderCode: async (req, res) => {
        try {
            const orderCode = await orderServive.generateOrderCode();
            // console.log(orderCode); // Log để debug thôi, xong thì nên xóa
            
            return res.status(200).json({
                success: true, 
                orderCode: orderCode // Trả thẳng orderCode ra ngoài cho dễ dùng ở FE
            });
        } catch (error) {
            console.error("Lỗi lấy mã đơn hàng:", error);
            return res.status(500).render('error/error', {
                status: 500,
                message: 'Mất kết nối với Server!',
                error: null
            });
        }
    }, 


    /**
     * khởi tạo lệnh order --> status = pending (chờ)
     */
    order: async (req, res) => {
        const userId = req.user.id;
        const {orderCode, totalAmount, paymentMethod, shippingPhone, shippingAddress, items} = req.body;
        const connection = await pool.getConnection()
        const orderQuery = 'INSERT INTO orders (order_code, user_id, total_amount, payment_method, status, shipping_phone, shipping_address) VALUES (?,?,?,?,?,?,?)';
        const orderStatus = (paymentMethod === 'QR') ? 'awaiting_payment' : 'pending';
        
        try {
            await connection.beginTransaction();
            const [orderResults] = await pool.query(
                orderQuery, 
                [orderCode, userId, totalAmount, paymentMethod, orderStatus, shippingPhone, shippingAddress]
            )
            
            //lấy order_id để liên kết với bảng order_results
            const orderId = orderResults.insertId;

            if(items && items.length > 0){
                const orderDertailsQuery = 'INSERT INTO order_details (order_id, product_id, quantity, unit_price, total_price) VALUES ?';
                const orderDetailValues = items.map(item => [
                    orderId,
                    Number(item.product_id),
                    item.quantity,
                    item.price,
                    item.quantity * item.price
                ])
                await connection.query(orderDertailsQuery, [orderDetailValues]);

                //xóa sản phẩm đã mua (sau này mở rộng chỉ xóa những sp đc chọn để mua)
                await connection.query('DELETE FROM cart WHERE user_id = ?', [userId]);
                await connection.commit()
            }
            res.status(200).json({success: true})
            
        } catch (error) {
            // Nếu có bất kỳ lỗi nào, hủy bỏ toàn bộ các lệnh INSERT ở trên
            await connection.rollback();
            console.error("Lỗi đặt hàng: ", error);
            res.status(500).render('error/error', {
                status: 500,
                message: 'Mất kết nối với Server!',
                error: null
            });
        }
    },
    
    purchasedProduct: async (req, res) => {
        try {
            const userId = req.user.id;
            // Lấy danh sách đơn hàng chưa hoàn thành/hủy
            const [orders] = await pool.query(
                `SELECT * FROM orders 
                WHERE user_id = ? AND status NOT IN ('completed', 'cancelled') 
                ORDER BY created_at DESC`,
                [userId]
            );
            res.render('user/purchasedProduct', {
                user: req.user,
                orders: orders,
                title: 'Sản phẩm đang mua'
            });
        } catch (error) {
            console.error("Lỗi lấy sản phẩm đang mua:", error);
            res.status(500).render('error/error', {
                status: 500,
                message: 'Mất kết nối với Server!',
                error: null
            });
        }
    },

    orderDetails: async (req, res) => {
        try {
            const orderId = req.params.id;
            const [orders] = await pool.query('SELECT * FROM orders WHERE id = ?', [orderId]);

            if (!orders || orders.length === 0) {
                return res.status(404).render('error/error', {
                    status: 404,
                    message: 'Không tìm thấy chi tiết đơn hàng!',
                    error: null
                });
            }

            //lay data don hang 
            const order = orders[0]; 
            const finalTotal = Number(order.total_amount);
            console.log('check finaltotal ', finalTotal)
            
            let shippingFee = 0;
            let subTotal = 0;

            // Logic bóc tách của Huy (Giữ nguyên vì logic này đã đúng yêu cầu 500k)
            if (finalTotal > 500000) {
                if (finalTotal - 30000 < 500000) {
                    shippingFee = 30000;
                    subTotal = finalTotal - 30000;
                } else {
                    shippingFee = 0;
                    subTotal = finalTotal;
                }
            } else {
                shippingFee = 30000;
                subTotal = finalTotal - 30000;
            }

            const [details] = await pool.query(
                `SELECT od.*, p.name as name, p.image_url 
                FROM order_details od 
                JOIN products p ON od.product_id = p.id 
                WHERE od.order_id = ?`, [orderId]
            );

            res.render('user/orderDetail', {
                user: req.user,
                order: order, 
                details: details,
                subTotal: subTotal,
                shippingFee: shippingFee,
                finalTotal: finalTotal,
                title: 'Chi tiết đơn hàng'
            });
        } catch (error) {
            console.error(error);
            res.status(500).render('error/error', {
                status: 500,
                message: 'Mất kết nối với Server!',
                error: null
            });
        }
    },

    async getHistory(req, res) {
        const userId = req.user.id;
        const orders = await pool.query(
            'SELECT * FROM orders WHERE user_id = ? AND status = "completed" ORDER BY created_at DESC', 
            [userId]
        );
        res.render('user/history', { orders: orders[0], user: req.user });
    },

    statistics: async (req, res) => {
        res.render('user/statistics')
    },
    
}

module.exports = cartController