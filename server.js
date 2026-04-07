const express = require('express');
const productRouter = require("./route/productRoutes.js")
const path = require("path")
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.use("/api", productRouter)
app.get("/", (req, res)=> res.redirect("/api/info") )


app.listen(3000, () => console.log("Server chạy tại http://localhost:3000"));