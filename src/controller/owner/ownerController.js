const db = require('../../../db'); 
const getContract = require('../../config/blockchain/blockchain');

const ownerController = {
    
    getMyProducts: async (req, res) => {
    try {
        const userId = req.user.id;
        const [userRows] = await db.query('SELECT wallet_address FROM users WHERE id = ?', [userId]);
        const walletAddress = userRows[0].wallet_address.toLowerCase();
        const [myProducts] = await db.query('SELECT * FROM products WHERE owner_address = ?', [walletAddress]);

        const contract = await getContract();
        const allChainProducts  = await contract.getAllProducts();

        const productsWithBlockchainData = myProducts.map(product => {

            const chainData = allChainProducts.find(item => item[0].toString() === product.id.toString());
            if (chainData) {
                return {
                    ...product,
                    blockchainOrigin: chainData[2], 
                    existsOnChain: true
                };
            }
            return { ...product, existsOnChain: false };
        });

        res.render('owner/myProducts', {
            products: productsWithBlockchainData,
            activePage: 'orders'
        });

    } catch (error) {
        console.log('Check ownerController error: ', error);
        res.status(404).render('error/error', { status: 404, message: 'Lỗi truy xuất dữ liệu!' });
    }
}

}


module.exports = ownerController