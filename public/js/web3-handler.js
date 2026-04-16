const CONTRACT_ADDRESS = "0x80cbB53dB47231D6F1Ea29Ec3815a7351B0c4151";
const CONTRACT_ABI = 
                    [
                    {
                        "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "_id",
                            "type": "uint256"
                        },
                        {
                            "internalType": "enum RootsTraceability.Status",
                            "name": "_status",
                            "type": "uint8"
                        },
                        {
                            "internalType": "string",
                            "name": "_location",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "_description",
                            "type": "string"
                        }
                        ],
                        "name": "addStage",
                        "outputs": [],
                        "stateMutability": "nonpayable",
                        "type": "function"
                    },
                    {
                        "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "_id",
                            "type": "uint256"
                        },
                        {
                            "internalType": "string",
                            "name": "_name",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "_origin",
                            "type": "string"
                        },
                        {
                            "internalType": "enum RootsTraceability.Status",
                            "name": "_initialStatus",
                            "type": "uint8"
                        }
                        ],
                        "name": "createProduct",
                        "outputs": [],
                        "stateMutability": "nonpayable",
                        "type": "function"
                    },
                    {
                        "inputs": [],
                        "stateMutability": "nonpayable",
                        "type": "constructor"
                    },
                    {
                        "inputs": [],
                        "name": "admin",
                        "outputs": [
                        {
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        }
                        ],
                        "stateMutability": "view",
                        "type": "function"
                    },
                    {
                        "inputs": [],
                        "name": "getAllProducts",
                        "outputs": [
                        {
                            "components": [
                            {
                                "internalType": "uint256",
                                "name": "id",
                                "type": "uint256"
                            },
                            {
                                "internalType": "string",
                                "name": "name",
                                "type": "string"
                            },
                            {
                                "internalType": "string",
                                "name": "origin",
                                "type": "string"
                            },
                            {
                                "internalType": "enum RootsTraceability.Status",
                                "name": "currentStatus",
                                "type": "uint8"
                            },
                            {
                                "internalType": "bool",
                                "name": "exists",
                                "type": "bool"
                            }
                            ],
                            "internalType": "struct RootsTraceability.Product[]",
                            "name": "",
                            "type": "tuple[]"
                        }
                        ],
                        "stateMutability": "view",
                        "type": "function"
                    },
                    {
                        "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "_id",
                            "type": "uint256"
                        }
                        ],
                        "name": "getHistory",
                        "outputs": [
                        {
                            "components": [
                            {
                                "internalType": "enum RootsTraceability.Status",
                                "name": "status",
                                "type": "uint8"
                            },
                            {
                                "internalType": "string",
                                "name": "location",
                                "type": "string"
                            },
                            {
                                "internalType": "string",
                                "name": "description",
                                "type": "string"
                            },
                            {
                                "internalType": "uint256",
                                "name": "timestamp",
                                "type": "uint256"
                            },
                            {
                                "internalType": "address",
                                "name": "performer",
                                "type": "address"
                            }
                            ],
                            "internalType": "struct RootsTraceability.Stage[]",
                            "name": "",
                            "type": "tuple[]"
                        }
                        ],
                        "stateMutability": "view",
                        "type": "function"
                    },
                    {
                        "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "_id",
                            "type": "uint256"
                        }
                        ],
                        "name": "getProductDetail",
                        "outputs": [
                        {
                            "components": [
                            {
                                "internalType": "uint256",
                                "name": "id",
                                "type": "uint256"
                            },
                            {
                                "internalType": "string",
                                "name": "name",
                                "type": "string"
                            },
                            {
                                "internalType": "string",
                                "name": "origin",
                                "type": "string"
                            },
                            {
                                "internalType": "enum RootsTraceability.Status",
                                "name": "currentStatus",
                                "type": "uint8"
                            },
                            {
                                "internalType": "bool",
                                "name": "exists",
                                "type": "bool"
                            }
                            ],
                            "internalType": "struct RootsTraceability.Product",
                            "name": "",
                            "type": "tuple"
                        }
                        ],
                        "stateMutability": "view",
                        "type": "function"
                    },
                    {
                        "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                        ],
                        "name": "productHistory",
                        "outputs": [
                        {
                            "internalType": "enum RootsTraceability.Status",
                            "name": "status",
                            "type": "uint8"
                        },
                        {
                            "internalType": "string",
                            "name": "location",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "description",
                            "type": "string"
                        },
                        {
                            "internalType": "uint256",
                            "name": "timestamp",
                            "type": "uint256"
                        },
                        {
                            "internalType": "address",
                            "name": "performer",
                            "type": "address"
                        }
                        ],
                        "stateMutability": "view",
                        "type": "function"
                    },
                    {
                        "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                        ],
                        "name": "productIds",
                        "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                        ],
                        "stateMutability": "view",
                        "type": "function"
                    },
                    {
                        "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                        ],
                        "name": "products",
                        "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "id",
                            "type": "uint256"
                        },
                        {
                            "internalType": "string",
                            "name": "name",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "origin",
                            "type": "string"
                        },
                        {
                            "internalType": "enum RootsTraceability.Status",
                            "name": "currentStatus",
                            "type": "uint8"
                        },
                        {
                            "internalType": "bool",
                            "name": "exists",
                            "type": "bool"
                        }
                        ],
                        "stateMutability": "view",
                        "type": "function"
                    }
                    ]

async function updateStageOnChain() {
    // Lấy dữ liệu từ các thẻ input trong Modal
    const id = document.querySelector('input[name="id"]').value;
    const status = document.querySelector('select[name="status"]').value;
    const location = document.querySelector('input[name="location"]').value;
    const description = document.querySelector('textarea[name="description"]').value;

    // Kiểm tra ví điện tử (MetaMask)
    if (typeof window.ethereum === 'undefined') {
        alert("Không tìm thấy ví Web3! Vui lòng dùng trình duyệt MetaMask để cập nhật.");
        return;
    }

    const btn = document.getElementById('btnConfirmUpdate');
    
    try {
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Đang kiểm tra mạng...';
        const targetChainIdHex = '0x539'; // 1337 chuyển sang dạng Hex là 0x539
        
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: targetChainIdHex }],
            });
            console.log("Đã chuyển sang mạng roots thành công.");
        } catch (switchError) {
            // Lỗi 4902: Mạng chưa được thêm vào MetaMask
            if (switchError.code === 4902) {
                alert("Mạng roots chưa được thêm vào MetaMask. Vui lòng thêm mạng với Chain ID 1337.");
                btn.disabled = false;
                btn.innerHTML = 'Xác nhận cập nhật';
                return;
            }
            throw switchError;
        }
        // ---------------------------------------------------------

        btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Đang kết nối ví...';

        // Khởi tạo Provider và Signer (Ethers v6)
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        
        // Kết nối Contract
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

        // Gửi giao dịch
        console.log("Đang gửi giao dịch lên Blockchain...");
        const tx = await contract.addStage(
        Number(id), 
        Number(status), 
        location, 
        description,
        {
            gasPrice: ethers.parseUnits('20', 'gwei'), 
            gasLimit: 500000 
        }
);
        
        btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Đợi xác nhận...';
        
        // 7. Đợi đào block
        await tx.wait();

        alert("Thành công! Giai đoạn mới đã được ghi lên Blockchain bởi ví: " + signer.address);
        window.location.reload();

    } catch (error) {
        console.error("Lỗi giao dịch:", error);
        
        // Xử lý trường hợp người dùng nhấn "Hủy" trong MetaMask
        if (error.code === 'ACTION_REJECTED' || error.code === 4001) {
            alert("Bạn đã từ chối giao dịch.");
        } else {
            alert("Giao dịch thất bại: " + (error.reason || error.message));
        }
        
        btn.disabled = false;
        btn.innerHTML = 'Xác nhận cập nhật';
    }
}

async function checkRole() {
    if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        
        if (accounts.length > 0) {
            const currentAccount = accounts[0].toLowerCase();
            const adminAddr = document.getElementById('adminAddr').value.toLowerCase().trim();
            
            //check địa chỉ (f12)
            console.log("Ví MetaMask:", currentAccount);
            console.log("Ví Admin từ .env:", adminAddr);

            if (currentAccount === adminAddr) {
                document.getElementById('btnOpenModal').style.display = 'inline-block';
            } 
        }
    }
}

window.onload = checkRole;