# AgriTrust - Blockchain-based Agricultural Traceability System

AgriTrust là một giải pháp full-stack ứng dụng công nghệ Blockchain nhằm giải quyết bài toán minh bạch hóa và **truy xuất nguồn gốc nông sản** trong chuỗi cung ứng. Hệ thống cho phép ghi nhận toàn bộ vòng đời của sản phẩm từ nông trại, quá trình vận chuyển, kiểm định chất lượng cho đến khi tới tay người tiêu dùng cuối cùng một cách bất biến (immutable) và minh bạch.

## Tính năng cốt lõi

- **Truy xuất nguồn gốc thời gian thực:** Ghi nhận và hiển thị chi tiết từng công đoạn trong chuỗi cung ứng nông sản (Nơi trồng, ngày thu hoạch, lịch trình vận chuyển, sẵn sàng bán trên cửa hàng, đã hết hàng).
- **Hợp đồng thông minh (Smart Contracts):** Tự động hóa việc xác thực quyền sở hữu (`owner verification logic`), chuyển giao trách nhiệm giữa các bên tham gia (Nông dân(owner) - admin - người dùng).
- **Tích hợp ví Web3:** Sử dụng **MetaMask** để ký số xác thực giao dịch và thực hiện các thanh toán, tương tác an toàn trong chuỗi.

## Công nghệ sử dụng

- **Backend:** Node.js, Express
- **Blockchain & Smart Contracts:** Ethereum, Solidity, Ganache (Môi trường test cục bộ)
- **Web3 Libraries:** Ethers.js (tương tác với Smart Contract và MetaMask)
- **Database:** MySQL(lưu trữ thông tin có thể thay đổi như tên, giá, số lượng... nhằm mục đích giảm tải gánh nặng khi truy vấn blockchain)

## Kiến trúc hệ thống (System Architecture)

Hệ thống hoạt động dựa trên sự kết hợp giữa kiến trúc Client-Server truyền thống và mạng lưới phi tập trung:
1. **Dữ liệu giao dịch & Trạng thái nông sản:** Được lưu trữ trực tiếp trên Ethereum Blockchain thông qua các Smart Contract.
2. **Logic ứng dụng:** Node.js đóng vai trò quản lý API, xác thực người dùng và hỗ trợ đồng bộ dữ liệu.

## Yêu cầu hệ thống (Prerequisites)

Để chạy dự án này ở môi trường local, bạn cần cài đặt trước:
- [Node.js](https://nodejs.org/) (v16.x hoặc mới hơn)
- [Ganache](https://trufflesuite.com/ganache/) (Phiên bản giao diện GUI hoặc CLI `npm install -g ganache-cli`)
- Tiện ích mở rộng [MetaMask](https://metamask.io/) trên trình duyệt.

## Hướng dẫn cài đặt và khởi chạy

### 1. Khởi động môi trường Blockchain Local
Mở Ganache và tạo một workspace mới (hoặc chạy lệnh `ganache-cli` trên terminal) để lấy danh sách các tài khoản thử nghiệm và Private Key.

### 2. Cài đặt các gói phụ thuộc (Dependencies)
Di chuyển vào thư mục dự án và cài đặt:
```bash
cd agritrust
npm install
```
### 3. Lệnh chạy thử nghiệm
```bash
cd agritrust
npm run dev
```
Server sẽ chạy tại localhost:3000
