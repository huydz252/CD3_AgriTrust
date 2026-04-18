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

    const qrUrl = `https://img.vietqr.io/image/${bankConfig.id}-${bankConfig.account}-${bankConfig.template}.png?amount=${amount}&addInfo=${encodeURIComponent(description)}`;

    document.getElementById('qrImage').src = qrUrl;
    document.getElementById('qrAmount').innerText = amount.toLocaleString('vi-VN') + 'đ';
    document.getElementById('qrDesc').innerText = description;

    const myModal = new bootstrap.Modal(document.getElementById('qrModal'));
    myModal.show();
});

document.getElementById('btn-checkout-cod')?.addEventListener('click', function() {
    const tempTotal = getRawAmount('temp-total') 
    const shipFee = getRawAmount('ship-fee')
    const finalTotal = tempTotal + shipFee
    document.getElementById('cod-temp').innerText = tempTotal.toLocaleString('vi-VN') + 'đ';
    document.getElementById('cod-ship').innerText = shipFee.toLocaleString('vi-VN') + 'đ';
    document.getElementById('cod-final').innerText = finalTotal.toLocaleString('vi-VN') + 'đ';
    const myModal = new bootstrap.Modal(document.getElementById('codModal'));
    myModal.show();
});