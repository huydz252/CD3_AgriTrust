const { ethers } = require("ethers");
const contractABI = require("./contractABI.json"); 
const contractAddress = process.env.CONTRACT_ADDRESS;

// Kết nối Ganache
const provider = new ethers.JsonRpcProvider("http://127.0.0.1:7545");

async function getContract() {
    try {
        const signer = await provider.getSigner();
        
        const contract = new ethers.Contract(contractAddress, contractABI, signer);
        
        return contract;
    } catch (error) {
        console.error("Lỗi kết nối Blockchain:", error);
        throw error;
    }
}

module.exports = getContract;