const db = require('../../../db'); 
const getContract = require('../../config/blockchain/blockchain');

const ownerController = {
    
    getMyProducts: async (req, res) => {
        try {
            const userId = req.user.id;
            const [userRows] = await db.query('SELECT wallet_address FROM users WHERE id = ?', [userId]);
            const walletAddress = userRows[0].wallet_address.toLowerCase();
            const [myProducts] = await db.query('SELECT * FROM products WHERE owner_address = ?', [walletAddress]);

            const contract = await getContract();
            const allChainProducts  = await contract.getAllProducts();

            const productsWithBlockchainData = myProducts.map(product => {

                const chainData = allChainProducts.find(item => item[0].toString() === product.id.toString());
                if (chainData) {
                    return {
                        ...product,
                        blockchainOrigin: chainData[2], 
                        existsOnChain: true
                    };
                }
                return { ...product, existsOnChain: false };
            });

            res.render('owner/myProducts', {
                products: productsWithBlockchainData,
                activePage: 'orders'
            });

        } catch (error) {
            console.log('Check ownerController error: ', error);
            res.status(404).render('error/error', { status: 404, message: 'Lỗi truy xuất dữ liệu!' });
        }
    },

    getMyOrders: async (req, res) => {
        try {
            const user = req.user;
            const walletAddress = user.wallet_address.toLowerCase(); 

            const query = `
                SELECT 
                    o.id as order_id,
                    o.order_code,
                    o.created_at,
                    p.id as product_id,
                    p.name as product_name, 
                    p.image_url,
                    p.price,
                    od.quantity,
                    od.status,
                    u.display_name as buyer_name,
                    u.email as buyer_email
                FROM orders o
                JOIN order_details od ON o.id = od.order_id
                JOIN products p ON od.product_id = p.id
                JOIN users u ON o.user_id = u.id
                WHERE p.owner_address = ? 
                ORDER BY o.created_at DESC
            `;

            const [orders] = await db.query(query, [walletAddress]);

            const groupedOrders = orders.reduce((acc, current) => {
                const found = acc.find(item => item.order_code === current.order_code);
                if (found) {
                    found.products.push(current);
                    found.totalAmount += Number(current.price );
                } else {
                    acc.push({
                        order_code: current.order_code,
                        buyer_name: current.buyer_name,
                        buyer_email: current.buyer_email,
                        created_at: current.created_at,
                        totalAmount: Number(current.price * Number(current.quantity)),
                        products: [current]
                    });
                }
                return acc;
            }, []);

            //console.log('check groupedOrders', groupedOrders);
            console.log('check groupedOrders', groupedOrders[0].products);
            res.render('owner/myOrders', {
                orders: groupedOrders,
                activePage: 'orders_management',
                title: 'Đơn hàng cần xử lý'
            });

        } catch (error) {
            console.error('Lỗi getMyOrders:', error);
            res.status(500).render('error/error', { 
                status: 500, 
                message: 'Không thể tải danh sách đơn hàng!' 
            });
        }
    }, 

    updateStatus : async (req, res) => {

        //danhf cho DB
        const statusWorkflow = {
            'pending': 'confirmed',
            'confirmed': 'processing',
            'processing': 'shipped',
            'shipped': 'completed',
            'completed' : null
        };

        //dành cho FE
        const getStatusName = {
            "pending": "Xác nhận đơn hàng", 
            "confirmed": "Xác nhận xử lí", 
            "processing": "Xác nhận giao hàng", 
            "shipped": "Xác nhận đã giao", 
            "completed": "Đơn đã hoàn thành rồi!",
            "cancelled": "Đã hủy"
        }

        try {
            const order_id  = req.query.od_id;
            const pro_id    = req.query.pro_id;
            const current_stt = req.query.current_stt;
            const cancelled_stt = req.query.cancelled_stt;

            if(!order_id || !pro_id || !current_stt){
                res.status(404).render('error/error', {
                    status: 404,
                    message: 'Thiếu dữ liệu quan trọng (order_id, pro_id hoặc current_stt)',
                    error: null
                })
            }

            //hủy đơn = set status = "cancelled" 
            //note FE: chỉ cho cancelled khi status = pendding
            // if (cancelled_stt) {
            //     const query = 'UPDATE order_details SET status = ? WHERE order_id = ? AND product_id = ?';
            //     const data_query = ['cancelled', order_id, pro_id];
            //     const updateStatus = await db.query(query, data_query);

            //     //update total_amount
            //     const old_totalAmound = await db.query(
            //         'SELECT total_amount FROM orders WHERE id = ?',
            //         [order_id]
            //     )
            //     const updateOders = await db.query(
            //         'UPDATE order SET total_amount = ? WHERE order_id = ?',
            //         [order_id]
            //     )
                
            // }

            //update chính!
            const nextStatus = statusWorkflow[current_stt];
            const nextStatusName = getStatusName[nextStatus] || "Tiếp tục xử lý";
            const query = 'UPDATE order_details SET status = ? WHERE order_id = ? AND product_id = ?';
            const data_query = [nextStatus, order_id, pro_id];

            const updateStatus = await db.query(query, data_query);
            
            return res.json({ 
                success: true, 
                nextStatus: nextStatus, 
                nextStatusName: nextStatusName,
                orderId: order_id,   
                productId: pro_id
            });
            
        } catch (error) {
            console.log('Lỗi: '. error);
            return res.json({ 
                success: false,
                message: 'Có lỗi! không thể cập nhật'
            });
        }
    }

}


module.exports = ownerController