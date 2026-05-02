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
                    found.totalAmount += Number(current.price);
                } else {
                    acc.push({
                        order_code: current.order_code,
                        buyer_name: current.buyer_name,
                        buyer_email: current.buyer_email,
                        created_at: current.created_at,
                        totalAmount: Number(current.price),
                        products: [current]
                    });
                }
                return acc;
            }, []);

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
    }

}


module.exports = ownerController