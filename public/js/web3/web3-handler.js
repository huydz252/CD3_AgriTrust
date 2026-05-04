const CONTRACT_ADDRESS = "0x34F3A6F78Ad35cd4f5Cb288089Cd0745D2fbE38b";
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
        "name": "_lat",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_lng",
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
        "internalType": "string",
        "name": "_lat",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_lng",
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
    "inputs": [
      {
        "internalType": "address",
        "name": "_newAdmin",
        "type": "address"
      }
    ],
    "name": "transferAdmin",
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
            "internalType": "address",
            "name": "owner",
            "type": "address"
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
            "name": "latitude",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "longitude",
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
            "internalType": "address",
            "name": "owner",
            "type": "address"
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
        "name": "latitude",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "longitude",
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
        "internalType": "address",
        "name": "owner",
        "type": "address"
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

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formCreateProduct'); // ID phải khớp với ID trong thẻ <form>
    
    if (form) {
        form.addEventListener('submit', handleAddProduct);
    }
});

async function handleAddProduct(event) {
    event.preventDefault();
    
    //data cho hàm createProduct trong contract
    const id = document.getElementById('productId').value;
    const name = document.getElementById('productName').value;
    const origin = document.getElementById('productOrigin').value;
    const lat = document.getElementById('productLat').value;
    const lng = document.getElementById('productLng').value;
    const status =  document.getElementById('productStatus').value; 

    try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const userAddress = accounts[0];

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

        const tx = await contract.createProduct(
          BigInt(id),           // Ép kiểu về BigInt cho uint256
          name, 
          origin, 
          lat, 
          lng, 
          Number(status),       // Ép kiểu về Number cho uint8/enum
          {
              gasPrice: ethers.parseUnits('20', 'gwei'), 
              gasLimit: 1000000 
          }
      );
        
        const receipt = await tx.wait(); 

        if (receipt.status === 1) {
            // giao dịch BC thành công -> Gửi về Server lưu MySQL
            const formData = new FormData(document.getElementById('formCreateProduct'));
            console.log('check formdata: ', formData)
            formData.append('owner_address', userAddress);
            formData.append('blockchain_confirm', 'success');

            const response = await fetch('/api/createProduct', {
                method: 'POST',
                body: formData 
            });

            if (response.ok) {
              Swal.fire('Thành công', 'Sản phẩm đã được đưa lên Blockchain và hệ thống!', 'success');
            }
        }
    } catch (error) {
        console.error("Lỗi:", error);
        Swal.fire('Thất bại', 'Giao dịch bị từ chối hoặc có lỗi xảy ra', 'error');
    }
}

async function updateStageOnChain() {
  const id = document.querySelector('input[name="id"]').value;
  // console.log('check id: ', id)
  const status = document.querySelector('select[name="status"]').value;
  const location = document.querySelector('input[name="location"]').value;
  const description = document.querySelector('textarea[name="description"]').value;
  const lat = document.querySelector('input[name="lat"]').value;
  const lng = document.querySelector('input[name="lng"]').value;

  // Kiểm tra ví điện tử (MetaMask)
  if (typeof window.ethereum === 'undefined') {
      alert("Không tìm thấy ví Web3! Vui lòng dùng trình duyệt MetaMask để cập nhật.");
      return;
  }

  const btn = document.getElementById('btnConfirmUpdate');
  
  try {
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Đang kiểm tra mạng...';
      const targetChainIdHex = '0x539'; // 1337
      
      try {
          await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: targetChainIdHex }],
          });
      } catch (switchError) {
          if (switchError.code === 4902) {
              alert("Mạng roots chưa được thêm vào MetaMask. Vui lòng thêm mạng với Chain ID 1337.");
              btn.disabled = false;
              btn.innerHTML = 'Xác nhận cập nhật';
              return;
          }
          throw switchError;
      }

      btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Đang kết nối ví...';

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      console.log("Đang gửi giao dịch lên Blockchain với tọa độ mới...");
      
      const tx = await contract.addStage(
          BigInt(id), 
          parseInt(status), 
          location, 
          lat.toString(), // Thêm vĩ độ
          lng.toString(), // Thêm kinh độ
          description.toString(),
          {
              gasPrice: ethers.parseUnits('20', 'gwei'), 
              gasLimit: 1000000 
          }
      );
      
      btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Đợi xác nhận...';
      
      await tx.wait();

      alert("Thành công! Giai đoạn di chuyển đã được ghi lên Blockchain.");
      window.location.reload();

  } catch (error) {
      console.error("Lỗi giao dịch:", error);
      const errorReason = error.reason || error.message || "";
      if (error.code === 'ACTION_REJECTED' || error.code === 4001) {
          Swal.fire('Thất bại', 'Giao dịch bị từ chối!', 'warning');
      }else if (errorReason.includes("caller is not the owner or admin")) {
          Swal.fire('Quyền truy cập', 'Chỉ Admin hoặc Chủ sở hữu mới có quyền cập nhật giai đoạn này!', 'error');
      } else {
          Swal.fire('Thất bại', 'Giao dịch thất bại, có lỗi xảy ra!', 'error');
      }
      
      btn.disabled = false;
      btn.innerHTML = 'Xác nhận cập nhật';
  }
}
