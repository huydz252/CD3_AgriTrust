async function updateProductStatus(orderId, productId, currentStatus, event) {
    const btn = event.currentTarget;
    const originalContent = btn.innerHTML;
    
    btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span>';
    btn.disabled = true;

    try {
        const isConfirm = confirm("Bạn có chắc chắn muốn xác nhận chuyển trạng thái cho sản phẩm này?");
        if (!isConfirm) return;
        const response = await fetch(`/owner/myOrders/updateStatus?od_id=${orderId}&pro_id=${productId}&current_stt=${currentStatus}`);
        const data = await response.json();

        if (data.success) {            
            if (!data.nextStatus || data.nextStatus === 'completed' ) { // Đơn đã hoàn thành
                const parent = btn.parentElement;

                let payoutInfo = '';
                // Nếu có mã giao dịch giải ngân, hiển thị link xem
                if (data.payoutHash) {
                    payoutInfo = `<div class="mt-1 small text-muted">TX: ${data.payoutHash.substring(0, 10)}...</div>`;
                }

               parent.innerHTML = `
                <span class="badge bg-light text-success border border-success px-3 py-2">
                <i class="bi bi-check-all me-1"></i> Đã hoàn tất
                </span>
                ${payoutInfo}`;

                if (data.payoutHash) {
                    Swal.fire('Thông báo', 'Đã giải ngân tiền về ví của bạn thành công trên Ganache!', 'success');
                }
            } else {
                // Cập nhật lại nút để lần bấm sau gửi status mới
                btn.setAttribute('onclick', `updateProductStatus('${data.orderId}', '${data.productId}', '${data.nextStatus}', event)`);
                btn.innerHTML = `<i class="bi bi-check-circle me-1"></i>${data.nextStatusName}`;
                btn.disabled = false;

                // Cập nhật nhãn trạng thái nằm ở trên nút
                const statusContainer = document.getElementById(`status-container-${productId}`);
                if (statusContainer) {
                    statusContainer.innerHTML = `<span class="badge bg-success"><i class="bi bi-info-circle me-1"></i>${data.nextStatusName}</span>`;
                }
            }
        } else {
            alert(data.message || 'Cập nhật thất bại!');
            btn.innerHTML = originalContent;
            btn.disabled = false;
        }
    } catch (error) {
        btn.innerHTML = originalContent;
        btn.disabled = false;
        alert('Lỗi hệ thống, vui lòng thử lại!');
    }
}


// 1. Hàm mở Modal và đổ dữ liệu cũ vào input
function openEditModal(productStr) {
    const product = JSON.parse(productStr);
    
    document.getElementById('edit-id').value = product.id;
    document.getElementById('edit-price').value = product.price;
    document.getElementById('edit-stock').value = product.stock;
    document.getElementById('edit-description').value = product.description;
    document.getElementById('edit-image_url').value = product.image_url;

    const editModal = new bootstrap.Modal(document.getElementById('editProductModal'));
    editModal.show();
}

// edit product 
document.addEventListener('click', function (event) {
    const btn = event.target.closest('.btn-edit-product');
    if (btn) {
        const product = JSON.parse(btn.getAttribute('data-product'));
        
        document.getElementById('edit-id').value = product.id;
        document.getElementById('edit-price').value = product.price;
        document.getElementById('edit-stock').value = product.stock;
        document.getElementById('edit-description').value = product.description;
        document.getElementById('edit-image_url').value = product.image_url;

        new bootstrap.Modal(document.getElementById('editProductModal')).show();
    }
});
document.getElementById('formEditProduct')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    const btn = document.getElementById('btnSaveEdit');
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Đang lưu...';

    const formData = {
        id: document.getElementById('edit-id').value,
        price: document.getElementById('edit-price').value,
        stock: document.getElementById('edit-stock').value,
        description: document.getElementById('edit-description').value,
        image_url: document.getElementById('edit-image_url').value
    };

    console.log('check form data: ', formData)

    try {
        const response = await fetch('/owner/myProducts/updateProduct', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const result = await response.json();
        if (result.success) {
            Swal.fire('Thành công', 'Thông tin sản phẩm đã được cập nhật!', 'success')
                .then(() => window.location.reload());
        } else {
            Swal.fire('Lỗi', result.message || 'Không thể cập nhật!', 'error');
        }
    } catch (error) {
        console.log(error);
        Swal.fire('Lỗi', 'Lỗi kết nối server!', 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = 'Lưu thay đổi';
    }
});