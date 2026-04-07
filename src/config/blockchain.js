const { ethers } = require("ethers");
const contractABI = require("./contraceABI.json"); 
const contractAddress = "0xa756f1a1a4D30880491916c7644E28Fd36568ADe"; 

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