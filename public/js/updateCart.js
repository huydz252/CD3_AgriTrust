function updateFinalTotal() {
    let total = 0;
    document.querySelectorAll('.cart-item').forEach(row => {
        const unitPrice = Number(row.querySelector('.unit-price').dataset.value) || 0;
        const qty = parseFloat(row.querySelector('.input-qty').value) || 0;
        total += unitPrice * qty;
    });

    let shipFee = 0;
    const shipFeeEl = document.getElementById('ship-fee');
    const btnQr = document.getElementById('btn-checkout-qr')
    const btnCod = document.getElementById('btn-checkout-cod'); 
    const btnMetamask = document.getElementById('btn-checkout-metamask');
    const msgMinOrder = document.getElementById('min-order-msg'); // Thông báo đơn < 50k

    if (total > 0 && total < 500000) {
        shipFee = 30000; 
        if(shipFeeEl) {
            shipFeeEl.innerText = '30.000đ';
            shipFeeEl.classList.replace('text-success', 'text-dark');
        }
    } else {
        shipFee = 0;
        if(shipFeeEl) {
            shipFeeEl.innerText = 'Miễn phí';
            shipFeeEl.classList.replace('text-dark', 'text-success');
        }
    }

    // Logic kiểm tra đơn hàng tối thiểu 50k
    if (total < 50000 && total >= 0) {
        if(msgMinOrder) msgMinOrder.classList.remove('d-none');
        btnQr.disabled = true;
        btnCod.disabled = true;
        btnMetamask.disabled = true;
    } else {
        if(msgMinOrder) msgMinOrder.classList.add('d-none');
        btnQr.disabled = false;
        btnCod.disabled = false;
        btnMetamask.disabled = false;
    }

    const finalTotal = total + shipFee;
    document.getElementById('temp-total').innerText = total.toLocaleString('vi-VN') + 'đ';
    document.getElementById('final-total').innerText = finalTotal.toLocaleString('vi-VN') + 'đ';
}

//load trang gọi hàm luôn
updateFinalTotal();

async function updateQtyOnServer(cart_id, newQty) {
    try {
        const response = await fetch('/user/cart/update-quantity', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cart_id, quantity: newQty })
        });
        const data = await response.json();
        if (!data.success) alert('Không thể cập nhật số lượng!');
    } catch (err) {
        console.error('Lỗi kết nối:', err);
    }
}

//sự kiện nút - + 
document.querySelectorAll('.btn-plus, .btn-minus').forEach(btn => {
    btn.addEventListener('click', function (){
        
        const row = this.closest('.cart-item');
        const input = row.querySelector('.input-qty');
        const unitPrice = Number(row.querySelector('.unit-price').dataset.value);
        const minQty = parseFloat(input.min) || 0.2
        const step = parseFloat(input.step) || 0.1
        let currentQty = parseFloat(input.value) || minQty;
        
        if (this.classList.contains('btn-plus')) 
            currentQty = currentQty + 0.1;
        else if (currentQty > minQty)  //còn trừ dc thì trừ (> min) 
            currentQty = currentQty - 0.1;
        
        input.value = Number(currentQty.toFixed(1));
        const rowTotal = unitPrice * currentQty;
        row.querySelector('.total-item-price').innerText = rowTotal.toLocaleString('vi-VN') + 'đ';

        updateFinalTotal();
        updateQtyOnServer(row.dataset.cart_id, currentQty);
        
        //update orderCode
        if (typeof window.resetOrderCode === 'function') {
        window.resetOrderCode();
    }
    })  
});

//sự kiện nút delete
document.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', async function() {
        if(!confirm('Xóa sản phẩm này?')) return
        
        //phai lay cart-item de xoa ca row
        const row = this.closest('.cart-item');
        const cart_id = row.dataset.cart_id;

        try {
            const response = await fetch('/user/cart/remove', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cart_id })
            });

            const data = await response.json();
            
            if(data.success){
                row.remove();
                updateFinalTotal()
            }else alert('Không thể xóa sản phẩm này!');
    
        } catch (err) {
            console.error('Lỗi kết nối:', err);
        }
        
        //update orderCode
        if (typeof window.resetOrderCode === 'function') {
            window.resetOrderCode();
        }
    });
});