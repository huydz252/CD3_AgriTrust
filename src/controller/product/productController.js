const db = require('../../../db'); 
const getContract = require('../../config/blockchain/blockchain');
const QRCode = require('qrcode')
const ADMIN_WALLET = process.env.ADMIN_WALLET

const productController = {

    getAllProducts: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = 3; 
            const offset = (page - 1) * limit;
            const isFetch = req.query.isFetch;

            const contract = await getContract();
            const products = await contract.getAllProducts();
            const adminAddress = process.env.ADMIN_WALLET;

            const [mysqlData] = await db.query('SELECT blockchain_id, price, image_url, description, stock FROM products');

            const results = products.map( p => {
                const extraInfo = mysqlData.find(m => m.blockchain_id == p.id.toString())
                return {
                    id: p.id.toString(),
                    name: p.name,
                    origin: p.origin,
                    currentStatus: Number(p.currentStatus),
                    exists: p.exists,
                    price: extraInfo ? extraInfo.price : "Liên hệ",
                    image: extraInfo ? extraInfo.image_url : "/images/system/default.jpg",
                    description: extraInfo ? extraInfo.description : "Không tìm thấy mô tả sản phẩm",
                    stock: extraInfo ? extraInfo.stock : 0
                }
            })

            const paginatedResults = results.slice(offset, offset + limit);
            const totalPages = Math.ceil(results.length / limit);

            //phân nhánh trả về
            const renderData = {
                list: paginatedResults,
                adminAddress: adminAddress,
                currentPage: page,
                totalPages: totalPages
            };

            if (isFetch == 'true') {
                console.log('da vao toi day 2')
                return res.render('partials/productItems', { 
                    renderData: renderData, 
                    layout: false 
                });
            }

            res.render('product/productList', {renderData: renderData,  adminAddress: adminAddress}  );
        } catch (error) {
            res.status(500).render('error/error', {
                status: 500,
                message: 'Mất kết nối với Server!',
                error: null
            });
        }
    },

    createProduct: async (req, res) => {
        try {
            const { id, name, origin, status, price, image_url, description, lat, lng, owner_address} = req.body;
            
            if (!id || !name || !owner_address) {
                return res.status(400).render('error/error', {
                    status: 400,
                    message: "Thiếu thông tin quan trọng để lưu sản phẩm!",
                    error: null
                });
            }
            
            await db.query(
                'INSERT INTO products (name, price, image_url, description, blockchain_id, latitude, longitude, owner_address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [name, price, image_url, description, parseInt(id), lat, lng, owner_address]
            );

            res.redirect("/");
        } catch (error) {
            res.status(500).render('error/error', {
                status: 500,
                message: 'Mất kết nối với Server!',
                error: null
            });
        }
    },

    getProductHistory: async (req, res) => {
        try {
            const id = req.params.id; 
            if (isNaN(id)) throw new Error("ID sản phẩm không hợp lệ");

            const contract = await getContract();

            const [history, productDetail, [rows]] = await Promise.all([
                contract.getHistory(BigInt(id)),
                contract.getProductDetail(BigInt(id)),
                db.query('SELECT * FROM products WHERE blockchain_id = ?', [id])
            ]);
            
            console.log('--- TEST TRUY VẤN SÂU ---');
            console.log('Phần tử đầu tiên:', history[0]?.location);
            try {
                const stage2 = await contract.productHistory(idBig, BigInt(1)); 
                console.log('Stage 2 tồn tại trực tiếp trên mapping:', stage2.location);
            } catch (e) {
                console.log('Lỗi: Mapping không có phần tử thứ 2 tại index 1');
            }
            
            // console.log('check productDetail: ', productDetail)
            // console.log('check [rows]: ', [rows])

            //định dạng Timeline từ Blockchain
            const formattedTimeline = history.map(h => ({
                status: Number(h.status),
                location: h.location,
                latitude: h.latitude,   
                longitude: h.longitude, 
                description: h.description,
                timestamp: new Date(Number(h.timestamp) * 1000).toLocaleString('vi-VN'),
                performer: h.performer
            }));

            const productFromDb = rows && rows.length > 0 ? rows[0] : null;

            const product = {
                id: productDetail.id.toString(),
                name: productDetail.name,
                origin: productDetail.origin,
                currentStatus: Number(productDetail.currentStatus),
                image: productFromDb ? productFromDb.image_url : '/images/system/default.jpg',
                fullDescription: productFromDb ? productFromDb.description : 'Đang cập nhật dữ liệu...',
                price: productFromDb ? productFromDb.price : '0',
                stock: productFromDb ? productFromDb.stock : '0',
                owner_address : productFromDb ? productFromDb.owner_address : ''
            };

            // console.log('check formattedTimeline: ', formattedTimeline)

            const adminAddress = process.env.ADMIN_WALLET || "";
            const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
            const qrUrl = `${baseUrl}/api/history/${id}`;
            const qrImage = await QRCode.toDataURL(qrUrl);

            res.render('product/productHistory', { 
                product: product, 
                list: formattedTimeline,
                qrCode: qrImage,
                adminAddress: adminAddress,
                isAdmin: true 
            });

        } catch (error) {
            console.error("Lỗi Controller tại getProductHistory:", error);
            
            res.status(500).render('error/error', {
                status: 500,
                message: 'Mất kết nối với Server!',
                error: null
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
            res.status(500).render('error/error', {
                status: 500,
                message: 'Mất kết nối với Server!',
                error: null
            });
        }
    },


};

module.exports = productController;