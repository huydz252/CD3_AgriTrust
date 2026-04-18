const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const pool = require('../../../db.js'); // Thay bằng đường dẫn đến file kết nối MySQL của Huy

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE google_id = ?', [profile.id]);
        
        if (rows.length > 0) {
            return done(null, rows[0]);
        } else {
            const newUser = {
                google_id: profile.id,
                email: profile.emails[0].value,
                display_name: profile.displayName,
                avatar_url: profile.photos[0].value,
                role: 'customer' // Mặc định là khách hàng
            };
            
            const [result] = await pool.query('INSERT INTO users SET ?', newUser);
            newUser.id = result.insertId;
            return done(null, newUser);
        }
    } catch (err) {
        console.error("Lỗi xác thực Google:", err);
        return done(err, null);
    }
  }
));

// Ghi ID người dùng vào Session (để duy trì đăng nhập)
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Đọc thông tin người dùng từ ID trong Session mỗi khi tải trang
passport.deserializeUser(async (id, done) => {
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
        done(null, rows[0]);
    } catch (err) {
        done(err, null);
    }
});