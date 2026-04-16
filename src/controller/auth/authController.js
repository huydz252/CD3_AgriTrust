
const authController = {
    
    loginPage: (req, res) => {
        if(req.isAuthenticated()){
            return redirect('/api/products')
        }
        res.render('login', {user: null})
    },

    googleCallback: (req, res) => {
        // Sau khi Passport xác thực thành công, thông tin user nằm trong req.user
        console.log("Đăng nhập thành công:", req.user.display_name);
        res.redirect('/api/products');
    },

    logout: (req, res, next) => {
        req.logout((err) => {
            if (err) { return next(err); }
            req.session.destroy(() => {
                res.clearCookie('connect.sid'); // Xóa cookie phiên làm việc
                res.redirect('/api/products');
            });
        });
    },
    
    // Middleware kiểm tra xem đã đăng nhập chưa (để bảo vệ giỏ hàng)
    isLoggedIn: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        }
        res.status(401).json({ 
            success: false, 
            message: "Bạn cần đăng nhập để thực hiện chức năng này" 
        });
    },

    // Middleware kiểm tra quyền admin
    isAdmin: (req, res, next) => {
        if (req.isAuthenticated() && req.user.role === 'admin') {
            return next();
        }
        res.status(403).send("Truy cập bị từ chối: Bạn không có quyền Admin");
    }
};

module.exports = authController;

