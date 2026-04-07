const getContract = require('../config/blockchain');

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
            
            res.json({ 
                success: true, 
                message: `Đã tạo sản phẩm ${name} thành công!`,
                transactionHash: tx.hash 
            });
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

        
            
        res.render('productHistory', { 
            product: productDetail, 
            list: formattedTimeline 
        });
        } catch (error) {
            console.error("Lỗi Controller:", error);
            res.status(500).json({ success: false, error: error.message });
        }
    }
};

module.exports = productController;