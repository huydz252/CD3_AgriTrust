function updateFinalTotal () {
    let total = 0;
    document.querySelectorAll('.cart-item').forEach(row => {
        const unitPrice = parseInt(row.querySelector('.unit-price').dataset.value);
        const qty = parseInt(row.querySelector('.input-qty').value);
        total += unitPrice * qty;
    });
    //cập nhật temp và final (vì chưa có phụ phí)
    document.getElementById('temp-total').innerText = total.toLocaleString('vi-VN') + 'đ';
    document.getElementById('final-total').innerText = total.toLocaleString('vi-VN') + 'đ';

}
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
        const unitPrice = parseInt(row.querySelector('.unit-price').dataset.value);
        let qty = parseInt(input.value);
        
        if (this.classList.contains('btn-plus')) qty++;
        else if (qty > 1) qty--;
        
        input.value = qty;
        const rowTotal = unitPrice * qty;
        row.querySelector('.total-item-price').innerText = rowTotal.toLocaleString('vi-VN') + 'đ';

        updateFinalTotal();
        updateQtyOnServer(row.dataset.cart_id, qty);
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
    })
})