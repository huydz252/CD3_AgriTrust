async function updateProductStatus(orderId, productId, currentStatus, event) {
    const btn = event.currentTarget;
    const originalContent = btn.innerHTML;
    
    btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span>';
    btn.disabled = true;

    try {
        const response = await fetch(`/owner/myOrders/updateStatus?od_id=${orderId}&pro_id=${productId}&current_stt=${currentStatus}`);
        const data = await response.json();

        if (data.success) {            
            if (!data.nextStatus || data.nextStatus === 'completed' ) { // Đơn đã hoàn thành
                const parent = btn.parentElement;
                parent.innerHTML = `
                    <span class="badge bg-light text-success border border-success px-3 py-2">
                        <i class="bi bi-check-all me-1"></i> Đã hoàn tất
                    </span>`;
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