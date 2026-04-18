// sidebar 
        const sidebar = document.getElementById("mySidebar");
        const overlay = document.getElementById("sidebarOverlay");
        const main = document.getElementById("main");

        // Hàm mở Sidebar
        document.getElementById("openSidebar").addEventListener("click", function() {
            sidebar.style.width = "250px";
            if (main) main.style.marginLeft = "250px";
            overlay.style.display = "block"; // Hiện lớp phủ
        });

        // Hàm đóng Sidebar
        function closeNav() {
            sidebar.style.width = "0";
            if (main) main.style.marginLeft = "0";
            overlay.style.display = "none"; // Ẩn lớp phủ
        }

        // Đóng khi bấm nút (X)
        document.getElementById("closeSidebar").addEventListener("click", closeNav);

        // Đóng khi click ra ngoài (click vào lớp phủ)
        overlay.addEventListener("click", closeNav);