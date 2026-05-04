document.addEventListener("DOMContentLoaded", function() {
    const openBtn = document.getElementById("openSidebar");
    const closeBtn = document.getElementById("closeSidebar");
    const sidebar = document.getElementById("mySidebar");
    const overlay = document.getElementById("sidebarOverlay");

    openBtn.addEventListener("click", function() {
        sidebar.style.width = "250px";
        if(overlay) overlay.style.display = "block"; // Hiện lớp phủ mờ
    });

    function closeNav() {
        sidebar.style.width = "0";
        if(overlay) overlay.style.display = "none"; // Ẩn lớp phủ mờ
    }

    closeBtn.addEventListener("click", closeNav);
    if(overlay) overlay.addEventListener("click", closeNav);
});