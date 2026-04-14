const getContract = require('../config/blockchain');
const QRCode = require('qrcode')
const ADMIN_WALLET = process.env.ADMIN_WALLET

const productController = {
    getProjectName: async (req, res) => {
        try {
            const contract = await getContract();
            const name = await contract.name();
            res.json({ success: true, name });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    

    getAllProducts: async (req, res) => {
        try {
            const contract = await getContract();
            // Gọi hàm mới trong file .sol Final
            const products = await contract.getAllProducts();

            const adminAddress = process.env.ADMIN_WALLET;

            const result = products.map(p => ({
                id: p.id.toString(),
                name: p.name,
                origin: p.origin,
                status: Number(p.currentStatus),
                exists: p.exists,
            }));
            res.render('productList', {list: result, adminAddress: adminAddress}  );
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    createProduct: async (req, res) => {
        try {
            const { id, name, origin, status } = req.body;

            const contract = await getContract(); 
            
            const tx = await contract.createProduct(
                Number(id), 
                name, 
                origin || "Chưa xác định",
                Number(status)
            );
            
            await tx.wait(); 

            res.redirect("/api/products")
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    getProductHistory: async (req, res) => {
        try {
            const id  = req.params.id;
            const contract = await getContract();
            const history = await contract.getHistory(id);
            const productDetail = await contract.getProductDetail(id)
            
            const formattedTimeline = history.map(h => ({
            status: Number(h.status),
            location: h.location,
            description: h.description,
            timestamp: new Date(Number(h.timestamp) * 1000).toLocaleString('vi-VN'), 
            performer: h.performer
            
        }));

        const adminAddress = process.env.ADMIN_WALLET;

        //qr
        const myIP = "172.25.13.236";
        const qrUrl = `http://${myIP}:3000/api/history/${id}`;
        // Tạo mã QR dạng chuỗi ảnh (Data URL)
        const qrImage = await QRCode.toDataURL(qrUrl);

        res.render('productHistory', { 
            product: productDetail, 
            list: formattedTimeline,
            qrCode: qrImage,
            adminAddress: adminAddress,
            isAdmin: true
        });
        } catch (error) {
            console.error("Lỗi Controller:", error);
            res.status(500).json({ success: false, error: error.message });
        }
    },


};

module.exports = productController;