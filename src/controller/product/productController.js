const db = require('../../../db'); 
const getContract = require('../../config/blockchain/blockchain');
const QRCode = require('qrcode')
const ADMIN_WALLET = process.env.ADMIN_WALLET

const productController = {

    getAllProducts: async (req, res) => {
        try {
            const contract = await getContract();
            const products = await contract.getAllProducts();

            const adminAddress = process.env.ADMIN_WALLET;

            const [mysqlData] = await db.query('SELECT blockchain_id, price, image_url, description FROM products');

            const results = products.map( p => {
                const extraInfo = mysqlData.find(m => m.blockchain_id == p.id.toString())
                return {
                    id: p.id.toString(),
                    name: p.name,
                    origin: p.origin,
                    status: Number(p.currentStatus),
                    exists: p.exists,
                    price: extraInfo ? extraInfo.price : "Liên hệ",
                    image: extraInfo ? extraInfo.image_url : "/images/system/default.jpg",
                    description: extraInfo ? extraInfo.description : "Không tìm thấy mô tả sản phẩm"
                }
            })
            res.render('product/productList', {list: results, adminAddress: adminAddress}  );
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    createProduct: async (req, res) => {
        try {
            const { id, name, origin, status, price, image_url, description} = req.body;
            const contract = await getContract(); 
        
            const tx = await contract.createProduct(Number(id), name, origin || "Chưa xác định", Number(status));
            await tx.wait(); 
            await db.query(
                'INSERT INTO products (name, price, image_url, description, blockchain_id) VALUES (?, ?, ?, ?, ?)',
                [name, price, image_url, description, id]
            );

            res.redirect("/api/products");
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    getProductHistory: async (req, res) => {
        try {
            const id = req.params.id;
            const contract = await getContract();
            
            const [history, productDetail, mysqlRows] = await Promise.all([
                contract.getHistory(id),
                contract.getProductDetail(id),
                db.query('SELECT * FROM products WHERE blockchain_id = ?', [id])
            ]);

            // định dạng lại Timeline từ Blockchain
            const formattedTimeline = history.map(h => ({
                status: Number(h.status),
                location: h.location,
                description: h.description,
                timestamp: new Date(Number(h.timestamp) * 1000).toLocaleString('vi-VN'),
                performer: h.performer
            }));

            // gộp thông tin: Ưu tiên lấy Ảnh và Mô tả chi tiết từ MySQL
            const extraInfo = mysqlRows[0][0]; 
            const product = {
                id: productDetail.id.toString(),
                name: productDetail.name,
                origin: productDetail.origin,
                currentStatus: Number(productDetail.currentStatus),
                image: extraInfo ? extraInfo.image_url : '/images/system/default.jpg',
                fullDescription: extraInfo ? extraInfo.description : 'Đang cập nhật dữ liệu...',
                price: extraInfo ? extraInfo.price : '0'
            };

            const adminAddress = process.env.ADMIN_WALLET;

            //QR Code
            const myIP = "172.21.224.1"; 
            const qrUrl = `http://${myIP}:3000/api/history/${id}`;
            const qrImage = await QRCode.toDataURL(qrUrl);

            // render
            res.render('product/productHistory', { 
                product: product, 
                list: formattedTimeline,
                qrCode: qrImage,
                adminAddress: adminAddress,
                isAdmin: true 
            });

        } catch (error) {
            console.error("Lỗi Controller tại getProductHistory:", error);
            res.status(500).render('error', { 
                message: "Không thể truy xuất nguồn gốc sản phẩm này.",
                error: error.message 
            });
        }
    },

    syncStatusWithMySQL: async (req, res) => {
    try {
        const { id, status } = req.body;
        
        // Cập nhật trạng thái mới nhất vào MySQL dựa trên blockchain_id
        const sql = 'UPDATE products SET status = ? WHERE blockchain_id = ?';
        await db.query(sql, [status, id]);

        res.json({ success: true, message: "Đồng bộ thành công" });
    } catch (error) {
        console.error("Lỗi đồng bộ MySQL:", error);
        res.status(500).json({ success: false, message: error.message });
    }
},


};

module.exports = productController;