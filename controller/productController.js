const getContract = require('../config/blockchain');

const productController = {
    // 1. Lấy tên dự án
    getProjectName: async (req, res) => {
        try {
            const contract = await getContract();
            const name = await contract.name();
            res.json({ success: true, name });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    // 2. Lấy toàn bộ sản phẩm (ID, Name, Origin, Status)
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

    // 3. Tạo sản phẩm mới (Nhận 3 tham số: id, name, origin)
    createProduct: async (req, res) => {
        try {
            const { id, name, origin } = req.query;
            const contract = await getContract(); // Phải có dòng này
            
            // Gọi hàm createProduct(id, name, origin) theo .sol mới
            const tx = await contract.createProduct(
                id, 
                name, 
                origin || "Chưa xác định"
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

    // 4. Lấy lịch sử chi tiết (Thêm trường Description)
    getProductHistory: async (req, res) => {
        try {
            const { id } = req.query;
            const contract = await getContract();
            const history = await contract.getHistory(id);
            
            const formatted = history.map(h => ({
                status: Number(h.status),       // Dùng tên thuộc tính thay cho h[0] nếu dùng JSON ABI
                location: h.location,           // h[1]
                description: h.description,     // h[2] - Trường mới thêm
                timestamp: new Date(Number(h.timestamp) * 1000).toLocaleString(), // Format ngày tháng cho đẹp
                performer: h.performer          // h[4]
            }));
            
            res.json({ success: true, id, timeline: formatted });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
};

module.exports = productController;