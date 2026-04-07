const { ethers } = require("ethers");
const contractABI = require("./contraceABI.json"); 
const contractAddress = "0xD7ACd2a9FD159E69Bb102A1ca21C9a3e3A5F771B"; 

// Kết nối Ganache
const provider = new ethers.JsonRpcProvider("http://127.0.0.1:7545");

async function getContract() {
    try {
        const signer = await provider.getSigner();
        
        // Sử dụng contractABI vừa nạp từ file JSON
        const contract = new ethers.Contract(contractAddress, contractABI, signer);
        
        return contract;
    } catch (error) {
        console.error("Lỗi kết nối Blockchain:", error);
        throw error;
    }
}

module.exports = getContract;