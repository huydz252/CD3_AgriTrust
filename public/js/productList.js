const paginationElem = document.getElementById('pagination-data');

// Lấy dữ liệu ra (lúc này là chuỗi, cần dùng parseInt)
let globalCurrentPage = parseInt(paginationElem.dataset.current);
let globalTotalPages = parseInt(paginationElem.dataset.total);
async function changePage(step) {
    // 1. Tính toán trang mục tiêu dựa trên biến global
    let targetPage = globalCurrentPage + step;

    // 2. Kiểm tra chặn biên
    if (targetPage < 1 || targetPage > globalTotalPages) return;

    try {
        console.log('da vao toi day!!!')
        const response = await fetch(`/api/products?page=${targetPage}&isFetch=true`);
        const html = await response.text();

        // 3. Cập nhật danh sách sản phẩm
        document.getElementById('product-container').innerHTML = html;

        // 4. CẬP NHẬT TRẠNG THÁI (Quan trọng nhất)
        globalCurrentPage = targetPage;
        
        // Cập nhật số hiển thị trên giao diện
        document.getElementById('current-page-display').innerText = globalCurrentPage;

        // Tùy chỉnh ẩn/hiện nút nếu ở trang đầu/cuối
        document.getElementById('prevBtn').disabled = (globalCurrentPage === 1);
        document.getElementById('nextBtn').disabled = (globalCurrentPage === globalTotalPages);

    } catch (err) {
        console.error("Lỗi chuyển trang:", err);
    }
}