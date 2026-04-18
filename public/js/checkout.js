function getRawAmount(elementId) {
    const text = document.getElementById(elementId).innerText;
    return parseInt(text.replace(/\D/g, '')) || 0;
}

document.getElementById('btn-checkout-qr')?.addEventListener('click', function() {
    const tempTotal = getRawAmount('temp-total');
    const shipFee = getRawAmount('ship-fee');
    const amount = tempTotal + shipFee;
    console.log("check amount: ", amount)
    const orderId = "AT" + Date.now(); 
    const description = `AgriTrust Thanh toan don hang ${orderId}`;
    
    const BANK_ID = "BIDV"; 
    const ACCOUNT_NO = "5624726359";
    const TEMPLATE = "compact"; 

    const qrUrl = `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-${TEMPLATE}.png?amount=${amount}&addInfo=${encodeURIComponent(description)}`;

    document.getElementById('qrImage').src = qrUrl;
    document.getElementById('qrAmount').innerText = amount.toLocaleString('vi-VN') + 'đ';
    document.getElementById('qrDesc').innerText = description;

    const myModal = new bootstrap.Modal(document.getElementById('qrModal'));
    myModal.show();
});