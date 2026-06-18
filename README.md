# 🎯 QuizCast - Hệ Thống Thi Trắc Nghiệm Trực Tuyến

![QuizCast Banner](./images/quizcast-banner.png)

## 📋 Giới Thiệu
**QuizCast** là nền tảng thi trắc nghiệm trực tuyến hiện đại, cho phép người dùng:
- 📝 Tạo và quản lý các bài kiểm tra trắc nghiệm
- ✍️ Tham gia thi các bài kiểm tra đã được công bố
- 📊 Xem kết quả và thống kê chi tiết
- 🔒 Bảo mật cao với xác thực người dùng

---

## 🎨 Giao Diện Chính

### Trang Chủ - Hệ Thống Thi Trắc Nghiệm Trực Tuyến
![Trang chủ](./images/homepage.png)

**Slogan**: *"Tạo và thầu gia cấc bài thi trắc nghiệm dễ dàng, nhanh chóng và tiền tố"*

### Các Tính Năng Chính

#### 1. 🤔 Ngân hàng Câu Hỏi
- Quản lý ngân hàng câu hỏi trắc nghiệm với nhiều chủ đề
- Dễ dàng thêm, chỉnh sửa và xóa các câu hỏi
- Phân loại câu hỏi theo danh mục

#### 2. ⏱️ Giới Hạn Thời Gian
- Thiết lập thời gian làm bài tùy theo độ khó
- Tự động chấm điểm khi hết giờ
- Thống kê thời gian làm bài chi tiết

#### 3. 🔀 Trộn Câu Hỏi
- Tự động trộn thứ tự câu hỏi và đáp án
- Đảm bảo tính công bằng trong thi cử
- Cấu hình linh hoạt theo nhu cầu

---

## 🛠️ Công Nghệ Sử Dụng

### Frontend
- **JavaScript** (99.3%) - Ngôn ngữ chính
- **HTML/CSS** - Xây dựng giao diện
- Framework/Library: *[Chi tiết sẽ được cập nhật]*

### Backend
- **Database**: SQL Server
  - 📊 Mô hình dữ liệu phức tạp
  - 🔑 Quản lý Identity và tracking 7 loại hành vi người dùng
  - 🔗 Mối quan hệ dữ liệu toàn diện

- **REST API**: Kiến trúc Repository & Service Pattern
  - 3 tầng kiến trúc rõ ràng
  - Dependency Injection
  - Data Transfer Objects (DTOs)

- **Streaming Video**: Real-time stream qua WebSocket
  - Xử lý FFmpeg để tạo file HLS
  - Quản lý đa luồng đồng thời

- **Authentication & Authorization**:
  - JWT Token
  - Role-Based Access Control
  - Tự động khóa tài khoản sau 10 lần sai mật khẩu

- **Email Notification**: Gửi email bất đồng bộ (async)

- **Data Mapping**: AutoMapper
  - Bidirectional & Nested Mapping

---

## ✨ Tính Năng Nổi Bật

| Tính Năng | Mô Tả |
|-----------|-------|
| 🔐 **Xác Thực Người Dùng** | Đăng nhập an toàn với JWT Token |
| 📱 **Giao Diện Responsive** | Tương thích với mọi thiết bị |
| 📊 **Thống Kê Chi Tiết** | Xem kết quả và phân tích hiệu suất |
| ⚡ **Tối Ưu Hiệu Suất** | Tải nhanh và phản hồi tức thì |
| 🎥 **Hỗ Trợ Video** | Kết hợp video trong bài thi |
| 🔔 **Thông Báo Email** | Nhận thông báo kết quả qua email |
| 🔀 **Xáo Trộn Câu Hỏi** | Ngăn gian lận trong thi cử |

---

## 🚀 Cài Đặt và Chạy

### Yêu Cầu
- Node.js >= 14.x
- npm hoặc yarn
- Browser hiện đại (Chrome, Firefox, Safari, Edge)

### Hướng Dẫn

1. **Clone repository**:
   ```bash
   git clone https://github.com/16November/FontendDATN.git
   cd FontendDATN
   ```

2. **Cài đặt dependencies**:
   ```bash
   npm install
   ```

3. **Cấu hình biến môi trường**:
   ```bash
   cp .env.example .env
   ```
   Chỉnh sửa `.env` với thông tin backend của bạn:
   ```
   REACT_APP_API_URL=http://localhost:5000
   REACT_APP_WS_URL=ws://localhost:5000
   ```

4. **Chạy ứng dụng**:
   ```bash
   npm start
   ```
   Ứng dụng sẽ mở tại `http://localhost:3000`

5. **Build cho production**:
   ```bash
   npm run build
   ```

---

## 📁 Cấu Trúc Dự Án

```
FontendDATN/
├── public/
├── src/
│   ├── components/        # Các component tái sử dụng
│   ├── pages/            # Các trang chính
│   ├── services/         # Gọi API
│   ├── styles/           # CSS/SCSS
│   ├── utils/            # Hàm tiện ích
│   └── App.js
├── package.json
└── README.md
```

---

## 👥 Tác Giả

- **Người phát triển**: 16November
- **Loại dự án**: Đồ Án Tốt Nghiệp (DATN)
- **Lĩnh vực**: Web Development - Frontend

---

## 📝 Ghi Chú

Đây là phần **Frontend** của hệ thống. Để chạy đầy đủ, bạn cần:
- Backend API được triển khai
- Database SQL Server được cấu hình
- WebSocket server cho video streaming

---

## 📧 Liên Hệ

Nếu có câu hỏi hoặc cần hỗ trợ, vui lòng liên hệ qua GitHub Issues.

---

**⭐ Nếu bạn thấy hữu ích, hãy star repository này!**

---

*Phát triển với ❤️ cho đồ án tốt nghiệp*
