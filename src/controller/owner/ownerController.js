const db = require('../../../db'); 
const getContract = require('../../config/blockchain/blockchain');
const { ethers } = require('ethers');

const ownerController = {
    
    getMyProducts: async (req, res) => {
        try {
            const userId = req.user.id;
            const [userRows] = await db.query('SELECT wallet_address FROM users WHERE id = ?', [userId]);
            const walletAddress = userRows[0].wallet_address.toLowerCase();
            const [myProducts] = await db.query('SELECT * FROM products WHERE owner_address = ?', [walletAddress]);

            const { contract, signer } = await getContract();
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

    updateProductInfo: async (req, res) => {
        try {
            const { id, price, stock, description, image_url } = req.body;
            const ownerId = req.user.id; 

            const query = `
                UPDATE products 
                SET price = ?, stock = ?, description = ?, image_url = ? 
                WHERE id = ? AND owner_address = (SELECT wallet_address FROM users WHERE id = ?)
            `;

            await db.query(query, [price, stock, description, image_url, id, ownerId]);
            res.json({ success: true });
        } catch (error) {
            console.error(error);
            res.status(500).render('error/error', { 
                success: false, 
                message: 'Lỗi server',
                error: null
            });
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
                    found.totalAmount += Number(current.price * current.quantity);
                    if (current.status !== 'completed') {
                        found.isAllCompleted = false;
                    }
                } else {
                    acc.push({
                        order_code: current.order_code,
                        buyer_name: current.buyer_name,
                        buyer_email: current.buyer_email,
                        created_at: current.created_at,
                        totalAmount: Number(current.price * Number(current.quantity)),
                        isAllCompleted: current.status === 'completed',
                        products: [current]
                    });
                }
                return acc;
            }, []);

            //console.log('check groupedOrders', groupedOrders);
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

        const order_id  = req.query.od_id;
        const pro_id    = req.query.pro_id;
        const current_stt = req.query.current_stt;
        const cancelled_stt = req.query.cancelled_stt;

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

        let connection;
        try {
            const connection = await db.getConnection()
            await connection.beginTransaction();
            
            const { contract, signer } = await getContract();

            if(!order_id || !pro_id || !current_stt){
                
                res.status(400).render('error/error', {
                    status: 400,
                    message: 'Thiếu dữ liệu quan trọng (order_id, pro_id hoặc current_stt)',
                    error: null
                })
            }

            //update status!
            const nextStatus = statusWorkflow[current_stt];
            const nextStatusName = getStatusName[nextStatus] || "Tiếp tục xử lý";
            const query = 'UPDATE order_details SET status = ? WHERE order_id = ? AND product_id = ?';
            const data_query = [nextStatus, order_id, pro_id];

            const updateStatus = await connection.query(query, data_query);

            //nếu là trạng thái pending->confirmed: trừ quantity
            if (current_stt === 'pending' && nextStatus === 'confirmed') {
                const [rows] = await connection.query(
                    'SELECT od.quantity, p.stock FROM order_details od JOIN products p ON od.product_id = p.id WHERE od.order_id = ? AND od.product_id = ?',
                    [order_id, pro_id]
                );

                if (rows.length > 0) {
                    const { quantity, stock } = rows[0];
                    if (stock < quantity) {
                        throw new Error('Số lượng hàng trong kho không đủ để xác nhận đơn hàng!');
                    }
                    await connection.query(
                        'UPDATE products SET stock = stock - ? WHERE id = ?',
                        [quantity, pro_id]
                    );
                }
            }

            // nếu là trạng thái cuối, giải ngân ETH cho owner (payment_method =  METAMASK)
            let payoutHash = null;
            if (nextStatus === 'completed') {
                //thông tin giá tiền và ví của Owner
                const [productInfo] = await connection.query(
                    `SELECT od.total_price, p.owner_address, o.payment_method 
                    FROM order_details od 
                    JOIN products p ON od.product_id = p.id 
                    JOIN orders o ON od.order_id = o.id
                    WHERE od.order_id = ? AND od.product_id = ?`, 
                    [order_id, pro_id]
                );

                const { total_price, owner_address, payment_method } = productInfo[0];

                //giải ngân
                if (payment_method === 'METAMASK') {
                    const ethExchangeRate = Number(process.env.ETH) || 1000000;
                    const ethAmount = (total_price / ethExchangeRate).toFixed(6);
                    
                    const { contract, signer } = await getContract(); 
                    
                    try {
                        const tx = await signer.sendTransaction({
                            to: owner_address,
                            value: ethers.parseEther(ethAmount.toString())
                        });
                        
                        const receipt = await tx.wait();
                        payoutHash = receipt.hash;
                    } catch (txError) {
                        console.error("Lỗi khi gửi ETH:", txError);
                    }
                }
            }

            //update trạng thái vào MySQL 
            const finalUpdateQuery = 'UPDATE order_details SET status = ?, payout_hash = ? WHERE order_id = ? AND product_id = ?';
            await connection.query(finalUpdateQuery, [nextStatus, payoutHash, order_id, pro_id]);
            await connection.commit();

            
            return res.json({ 
                success: true, 
                nextStatus: nextStatus, 
                nextStatusName: nextStatusName,
                orderId: order_id,   
                productId: pro_id
            });
            
        } catch (error) {
            if (connection) await connection.rollback();
            console.error('Lỗi updateStatus:', error);
            return res.json({ success: false, message: error.message || 'Cập nhật thất bại' });
        } finally {
            if (connection) connection.release(); 
        }
    }

}


module.exports = ownerController