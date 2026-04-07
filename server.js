const express = require('express');
const productRouter = require("./src/route/productRoutes.js")
const path = require("path")
const app = express();

//config req.body
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './src/views'));

app.use("/api", productRouter)
app.get("/", (req, res)=> res.redirect("/api/products") )


app.listen(3000, () => console.log("Server chạy tại http://localhost:3000"));