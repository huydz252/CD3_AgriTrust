const db = require('../../db'); 
const blockchain = require('../config/blockchain'); 

exports.getAllProducts = async (req, res) => {
    try {
        const [mysqlProducts] = await db.query('SELECT * FROM products');
        res.render('productList', { products: mysqlProducts });
    } catch (error) {
        console.error("Lỗi:", error);
        res.status(500).send("Không thể tải danh sách sản phẩm");
    }
};

// 2. Lấy lịch sử sản phẩm (TRÁI TIM của dự án: Kết hợp cả 2 nguồn)
exports.getProductHistory = async (req, res) => {
    const productId = req.params.id; // Đây là ID từ URL

    try {
        // BƯỚC A: Lấy thông tin chi tiết (Ảnh, Mô tả) từ MySQL
        const [mysqlInfo] = await db.query('SELECT * FROM products WHERE blockchain_id = ?', [productId]);
        
        // BƯỚC B: Lấy nhật ký truy xuất từ Blockchain (Sử dụng hàm trong Smart Contract)
        // Giả sử hàm trong contract của Huy tên là getProductHistory
        const historyData = await blockchain.methods.getProductHistory(productId).call();

        // BƯỚC C: Gộp lại và gửi sang EJS
        res.render('productHistory', { 
            product: mysqlInfo[0], // Thông tin từ MySQL
            history: historyData   // Dữ liệu thô từ Blockchain
        });
    } catch (error) {
        console.error("Lỗi truy xuất:", error);
        res.render('error', { message: "Không tìm thấy dữ liệu truy xuất nguồn gốc" });
    }
};

// 3. Tạo sản phẩm mới (Lưu cả 2 nơi)
exports.createProduct = async (req, res) => {
    const { name, price, description, image_url } = req.body;
    
    try {
        // BƯỚC 1: Gửi dữ liệu lên Blockchain trước để lấy Transaction Hash hoặc ID
        // const receipt = await blockchain.methods.createProduct(...).send({ from: ... });
        // const newId = receipt.events.ProductCreated.returnValues.id;

        // BƯỚC 2: Lưu vào MySQL để hiển thị nhanh
        const sql = 'INSERT INTO products (name, price, description, image_url, blockchain_id) VALUES (?, ?, ?, ?, ?)';
        await db.query(sql, [name, price, description, image_url, 1 /* thay bằng newId */]);

        res.redirect('/products');
    } catch (error) {
        res.status(500).send("Lỗi tạo sản phẩm");
    }
};