let currentPage = parseInt(document.getElementById('currentPageDisplay').innerText);
let totalPages = parseInt(document.getElementById('totalPagesDisplay').innerText);

async function changePage(step) {
    const targetPage = currentPage + step;

    if (targetPage < 1 || targetPage > totalPages) return;

    // Hiệu ứng loading cho nút bấm
    const btn = step === 1 ? document.getElementById('nextBtn') : document.getElementById('prevBtn');
    const originalContent = btn.innerHTML;
    btn.innerHTML = `<span class="spinner-border spinner-border-sm"></span>`;
    btn.disabled = true;

    try {
        //mặc định get
        const response = await fetch(`/api/products?page=${targetPage}&isFetch=true`);
        
        if (!response.ok) throw new Error("Lỗi tải dữ liệu");

        const html = await response.text();

        document.getElementById('product-container').innerHTML = html;

        currentPage = targetPage;
        document.getElementById('currentPageDisplay').innerText = currentPage;

        updateButtonStates();
    } catch (err) {
        alert("Có lỗi xảy ra: " + err.message);
    } finally {
        btn.innerHTML = originalContent;
        btn.disabled = false;
        updateButtonStates();
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0, 
        behavior: 'smooth' 
    });
}

function updateButtonStates() {
    document.getElementById('prevBtn').disabled = (currentPage === 1);
    document.getElementById('nextBtn').disabled = (currentPage === totalPages);
    
    // disabled
    document.getElementById('prevBtnWrapper').classList.toggle('disabled', currentPage === 1);
    document.getElementById('nextBtnWrapper').classList.toggle('disabled', currentPage === totalPages);
}

// Gọi lần đầu để set trạng thái nút
updateButtonStates();