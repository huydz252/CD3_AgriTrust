const  pool  = require("../../../db");

const profileController = {

    showCart : async (req, res) => {
        
        try {
            
            res.render('user/profile', cartItems)
        } catch (error) {
            console.error("gặp lỗi: ", error)
            res.status(500).send("Lỗi khi render profile")
        }
        
    }
}
module.exports = profileController