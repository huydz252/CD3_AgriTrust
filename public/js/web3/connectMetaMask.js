async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            //ket noi vi
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const walletAddress = await signer.getAddress();

            console.log("Địa chỉ ví:", walletAddress);

            const response = await fetch('/user/update-wallet', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ walletAddress })
            });

            const data = await response.json();
            if (data.success) {
                alert("Kết nối ví thành công!");
                location.reload(); //Load lại để hiện địa chỉ ví 
            }else{
                alert("⚠️ Thông báo: " + (data.message || "Lỗi không xác định"));
            }
        } catch (error) {
            console.error("Người dùng từ chối kết nối hoặc có lỗi:", error);
        }
    } else {
        alert("Vui lòng cài đặt ví MetaMask trên trình duyệt!");
        window.open('https://metamask.io/download/', '_blank');
    }
}

document.getElementById('btn-connectMM')?.addEventListener('click', connectWallet);
