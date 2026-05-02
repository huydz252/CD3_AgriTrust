const authController = {

    loginPage: (req, res) => {
        if(req.isAuthenticated()){
            return redirect('/api/products')
        }
        res.render('login', {user: null})
    },

    googleCallback: (req, res) => {
        res.redirect('/api/products');
    },

    logout: (req, res, next) => {
        req.logout((err) => {
            if (err) { return next(err); }
            req.session.destroy(() => {
                res.clearCookie('connect.sid'); 
                res.redirect('/api/products');
            });
        });
    },
    
    // Middleware kiểm tra xem đã đăng nhập chưa (để bảo vệ giỏ hàng)
    isLoggedIn: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        }
        res.status(401).render('error/error', {
            status: 401,
            message: "Bạn cần đăng nhập để thực hiện chức năng này!",
            error: null
        });
    },

    // Middleware kiểm tra quyền 
    isAdmin: (req, res, next) => {
        if (req.isAuthenticated() && req.user.role === 'admin') {
            return next();
        }
        res.status(403).render('error/error', {
            status: 403,
            message: 'Truy cập bị từ chối: Bạn không có quyền Admin!',
            error: null
        });
    },

    isOwner: (req, res, next) => {

        if (req.isAuthenticated() && req.user.role === 'admin') {
            return next();
        }
        if (req.isAuthenticated() && req.user.role === 'owner') {
            return next();
        }
        
        res.status(403).render('error/error', {
            status: 403,
            message: 'Truy cập bị từ chối: Bạn không có quyền Owner!',
            error: null
        });
    }
};

module.exports = authController;

