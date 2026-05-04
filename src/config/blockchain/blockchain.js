const { ethers } = require("ethers");
const contractABI = require("./contractABI.json"); 
const contractAddress = process.env.CONTRACT_ADDRESS;

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:7545");

async function getContract() {
    try {
        //Lấy Private Key của ví Admin 
        const adminPrivateKey = process.env.ADMIN_PRIVATE_KEY; 
        if (!adminPrivateKey) {
            throw new Error("Thiếu ADMIN_PRIVATE_KEY trong file .env");
        }
        
        //Tạo một Wallet (Signer) từ Private Key
        const signer = new ethers.Wallet(adminPrivateKey, provider);
        
        // Kết nối Contract với Signer này
        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        return { contract, signer }; 
    } catch (error) {
        console.error("Lỗi kết nối Blockchain:", error);
        throw error;
    }
}

module.exports = getContract;