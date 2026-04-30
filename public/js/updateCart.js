 //buton add to cart: fetch cho nó mượt
async function addToCart(productId) {

    // check stock trước khi thêm:
    const minQty = 0.2;
    const stockStatus = await checkProductStock(productId, minQty);

    if (!stockStatus.isAvailable) {
        Swal.fire({
            title: 'Hết hàng!',
            text: `Sản phẩm này chỉ còn ${stockStatus.currentStock} kg, không đủ để thêm vào giỏ.`,
            icon: 'error'
        });
        return;
    }
    // --------------------
    fetch('/user/cart/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId: productId }) // Gửi productId dưới dạng JSON
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Hiện thông báo xanh mướt
            Swal.fire({
                title: 'Thành công!',
                text: data.message,
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            });
        } else {
            // Hiện thông báo lỗi hoặc yêu cầu đăng nhập
            Swal.fire({
                title: 'Opps!',
                text: data.message,
                icon: 'warning'
            });
            if (data.message === 'Vui lòng đăng nhập!') {
                setTimeout(() => window.location.href = '/auth/google', 1500);
            }
        }
    })
    .catch(error => {
        console.error('Lỗi:', error);
        Swal.fire({
                title: 'Opps!',
                text: 'Có lỗi xảy ra, vui lòng thử lại!',
                icon: 'warning'
        });
    });
}

// kiểm tra số stock trước khi thêm vào giỏ or cập nhật giỏ
async function checkProductStock(productId, requestedQty) {
    try {
        const response = await fetch('/user/cart/getStock', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId: productId })
        });
        const data = await response.json();

        if (!data.success) {
            throw new Error(data.message || 'Không thể kiểm tra kho hàng');
        }

        // Trả về kết quả so sánh: đủ hàng hay không
        return {
            isAvailable: data.stock >= requestedQty,
            currentStock: data.stock
        };
    } catch (error) {
        console.error('Lỗi checkStock:', error);
        return { isAvailable: false, error: error.message };
    }
}

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

async function updateQtyOnServer(cart_id, newQty) {
    try {
        const response = await fetch('/user/cart/update-quantity', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cart_id, quantity: newQty })
        });
        const data = await response.json();
        if (!data.success) {
            Swal.fire({
                title: 'Opps!',
                text: 'Hiện tại không thể cập nhật số lượng!!',
                icon: 'warning'
            });
        }
    } catch (err) {
        console.error('Lỗi kết nối:', err);
    }
}

//sự kiện nút - + 
document.querySelectorAll('.btn-plus, .btn-minus').forEach(btn => {
    btn.addEventListener('click', async function () {
        const row = this.closest('.cart-item');
        const input = row.querySelector('.input-qty');
        const unitPrice = Number(row.querySelector('.unit-price').dataset.value);
        const productId = row.dataset.product_id;
        console.log('check product_id: ', productId)
        const minQty = parseFloat(input.min) || 0.2;
        let currentQty = parseFloat(input.value) || minQty;

        // Hàm phụ để cập nhật UI tránh viết lặp code
        const updateUI = (qty) => {
            input.value = Number(qty.toFixed(1));
            row.querySelector('.total-item-price').innerText = (unitPrice * qty).toLocaleString('vi-VN') + 'đ';
            updateFinalTotal();
            updateQtyOnServer(row.dataset.cart_id, Number(qty.toFixed(1)));
            if (typeof window.resetOrderCode === 'function') window.resetOrderCode();
        };

        if (this.classList.contains('btn-plus')) {
            const nextQty = currentQty + 0.1;
                const stockStatus = await checkProductStock(productId, nextQty);

                if (stockStatus.isAvailable) {
                    updateUI(nextQty); // Hàm updateUI mình đã viết ở trên
                } else {
                    Swal.fire({ title: 'Opps!', text: 'Vượt quá tồn kho!', icon: 'warning' });
            }
        } else if (currentQty > minQty) {
            updateUI(currentQty - 0.1); 
        }else if(currentQty == minQty){
            Swal.fire({ title: 'Opps!', text: 'Tối thiểu 0.2 kg!', icon: 'warning' });
        }
    });
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
            }else Swal.fire({
                title: 'Opps!',
                text: 'Hiện không thể xóa sản phẩm này!',
                icon: 'warning'
        });
    
        } catch (err) {
            console.error('Lỗi kết nối:', err);
        }
        
        //update orderCode
        if (typeof window.resetOrderCode === 'function') {
            window.resetOrderCode();
        }
    });
});