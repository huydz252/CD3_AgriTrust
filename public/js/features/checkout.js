function getRawAmount(elementId) {
    const text = document.getElementById(elementId).innerText;
    return parseInt(text.replace(/\D/g, '')) || 0;
}

let savedOrderCode = null;
async function getOrderCode (){
    if (savedOrderCode) return savedOrderCode;

    try {
        const response = await fetch('/user/cart/getOrderCode');
        const results = await response.json();
        savedOrderCode = results.orderCode; 
        return savedOrderCode;
    } catch (error) {
        console.error("Không lấy được mã đơn hàng:", error);
        return "ERROR_CODE";
    }
}
window.resetOrderCode = function() {
    savedOrderCode = null;
    console.log("Đã reset mã đơn hàng do giỏ hàng thay đổi.");
};

document.getElementById('btn-checkout-qr')?.addEventListener('click', async function() {
    const tempTotal = getRawAmount('temp-total');
    const shipFee = getRawAmount('ship-fee');
    const amount = tempTotal + shipFee;
    //console.log("check amount: ", amount)

    const orderId = await getOrderCode()
    const description = `AgriTrust Thanh toan don hang ${orderId}`;

    const qrUrl = `https://img.vietqr.io/image/${bankConfig.id}-${bankConfig.account}-${bankConfig.template}.png?amount=${amount}&addInfo=${encodeURIComponent(description)}`;

    document.getElementById('qrImage').src = qrUrl;
    document.getElementById('qrAmount').innerText = amount.toLocaleString('vi-VN') + 'đ';
    document.getElementById('qrDesc').innerText = description;

    const myModal = new bootstrap.Modal(document.getElementById('qrModal'));
    myModal.show();
});

document.getElementById('btn-checkout-cod')?.addEventListener('click', async function() {
   
    try {
        const orderId = await getOrderCode()
        const tempTotal = getRawAmount('temp-total') 
        const shipFee = getRawAmount('ship-fee')
        const finalTotal = tempTotal + shipFee

        document.getElementById('cod-temp').innerText = tempTotal.toLocaleString('vi-VN') + 'đ';
        document.getElementById('cod-ship').innerText = shipFee ==0 ? "Miễn phí" : shipFee.toLocaleString('vi-VN') + 'đ';
        document.getElementById('cod-final').innerText = finalTotal.toLocaleString('vi-VN') + 'đ';
        document.getElementById('order-code').innerText = orderId;
        
        const myModal = new bootstrap.Modal(document.getElementById('codModal'));
        myModal.show();
    } catch (error) {
        console.error("Lỗi: ", error)
    }
    
});

function getCartData() {
    const items = [];
    document.querySelectorAll('.cart-item').forEach(row => {
        items.push({
            product_id: row.getAttribute('data-product_id'), 
            quantity: parseFloat(row.querySelector('.input-qty').value),
            price: parseInt(row.querySelector('.unit-price').innerText.replace(/\D/g, ''))
        });
    });
    return items;
}
document.getElementById('confirm-cod-btn')?.addEventListener('click', async function() {
    const data = {
        orderCode: document.getElementById('order-code').innerText, 
        shippingPhone: document.getElementById('cod-phone').value,
        shippingAddress: document.getElementById('cod-address').value,
        paymentMethod: 'COD',   
        totalAmount: getRawAmount('cod-final'),
        items: getCartData() 
    };

    console.log("check data post: ", data)

    const response = await fetch('/user/cart/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    const result = await response.json();
    if (result.success) {
        //xóa biến savedOrderCode để phiên sau ra mã mới
        if (typeof window.resetOrderCode === 'function') window.resetOrderCode();
        
        alert("Đặt hàng thành công!");
        window.location.href = "/user/cart";
    }
});