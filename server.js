require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport'); // require passport trước
const path = require("path");

// Import Routes
const productRouter = require("./src/route/productRoutes.js");
const authRouter = require("./src/route/authRoutes.js");

const app = express();

// config Middleware (body-parser, static)
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

//view Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './src/views'));

// Session (đặt trc passport.initialize)
app.use(session({
  secret: process.env.SESSION_SECRET, 
  resave: false,
  saveUninitialized: false, 
  cookie: { secure: false } 
}));

app.use(passport.initialize());
app.use(passport.session());

require('./src/config/auth/passport');
// Middleware để truyền user vào local variables của mọi View
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
}); 

app.use("/api", productRouter);
app.use("/auth", authRouter);
app.get("/", (req, res) => res.redirect("/api/products"));

app.listen(3000, () => console.log("🚀 Server AgriTrust chạy tại http://localhost:3000"));