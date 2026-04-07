const getContract = require('../config/blockchain');
const QRCode = require('qrcode')

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
            
            const result = products.map(p => ({
                id: p.id.toString(),
                name: p.name,
                origin: p.origin,
                status: Number(p.currentStatus),
                exists: p.exists
            }));
            
            //res.json({ success: true, total: formatted.length, data: formatted });
            res.render('productList', {list: result});
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    createProduct: async (req, res) => {
        try {
            const { id, name, origin, status } = req.body;
            const contract = await getContract(); // Phải có dòng này
            
            // Gọi hàm createProduct(id, name, origin) theo .sol mới
            const tx = await contract.createProduct(
                Number(id), 
                name, 
                origin || "Chưa xác định",
                Number(status)
            );
            
            await tx.wait(); // Đợi block xác nhận
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
            // Format ngày tháng theo giờ Việt Nam
            timestamp: new Date(Number(h.timestamp) * 1000).toLocaleString('vi-VN'), 
            performer: h.performer
            
        }));

        //qr
        const protocol = req.protocol;
        const myIP = "192.168.1.16";
        const qrUrl = `http://${myIP}:3000/api/history/${id}`;
        // Tạo mã QR dạng chuỗi ảnh (Data URL)
        const qrImage = await QRCode.toDataURL(qrUrl);

        res.render('productHistory', { 
            product: productDetail, 
            list: formattedTimeline,
            qrCode: qrImage
        });
        } catch (error) {
            console.error("Lỗi Controller:", error);
            res.status(500).json({ success: false, error: error.message });
        }
    },

    updateStage: async (req, res) => {
        try {
            const {id, status, location, description} = req.body
            const contract = await getContract();
            const addStage = await contract.addStage(
                Number(id), 
                Number(status), 
                location, 
                description
            )
            await addStage.wait();
            res.redirect(`/api/history/${id}`);
        } catch (error) {
            console.log("Lỗi controller", error)
            res.status(500).json({ success: false, error: error.message });
        }
    },

};

module.exports = productController;