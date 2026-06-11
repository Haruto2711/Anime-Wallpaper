# ĐỀ BÀI LUYỆN TẬP: WEBSITE CHIA SẺ HÌNH NỀN ANIME (ANIME WALLPAPER HUB)

Chào mừng bạn đến với bài tập thực hành xây dựng ứng dụng Web bằng **ReactJS**. Đây là một đề tài thực tế giúp bạn luyện tập các kỹ năng: chia component, gọi API (CRUD), quản lý state, định tuyến (routing), xử lý form và thiết kế giao diện UI/UX hiện đại.

---

## 🛠️ Công nghệ khuyến nghị sử dụng
1. **Frontend**: ReactJS (đã được tạo sẵn trong thư mục).
2. **Styling**: Vanilla CSS (hoặc cài thêm Tailwind CSS nếu muốn).
3. **Mock API Server**: `json-server` để giả lập REST API từ file [db.json](file:///d:/React-Js-project/AnimeWallpaper/animewallpaper/db.json).
4. **Library phụ trợ (tùy chọn)**: `react-router-dom` (để làm chuyển trang), `lucide-react` hoặc `react-icons` (cho icon), `axios` (gọi API).

---

## 📂 Dữ liệu có sẵn
Hệ thống đã chuẩn bị sẵn cho bạn:
- **Ảnh hình nền chất lượng cao**: Nằm trong thư mục [public/wallpapers/](file:///d:/React-Js-project/AnimeWallpaper/animewallpaper/public/wallpapers). Bạn có thể truy cập chúng trực tiếp qua đường dẫn tương đối (ví dụ: `/wallpapers/cyberpunk_girl.png`).
- **File Database**: [db.json](file:///d:/React-Js-project/AnimeWallpaper/animewallpaper/db.json) chứa cấu trúc của `categories`, `wallpapers`, và `comments`.

---

## 📋 Yêu cầu chức năng (Chia theo cấp độ điểm)

### Mức độ 1: Đạt yêu cầu (Cơ bản - Điểm 5-6)
1. **Giao diện trang chủ (Home Page)**:
   - Header (Logo, Menu điều hướng, Thanh tìm kiếm).
   - Banner nổi bật (Hero Section) hiển thị các hình nền có thuộc tính `featured: true` (sử dụng Slider hoặc Carousel tự thiết kế).
   - Danh sách danh mục (Categories) để người dùng click chọn lọc hình nền theo danh mục.
2. **Hiển thị danh sách hình nền**:
   - Lấy dữ liệu từ API `/wallpapers` của `json-server`.
   - Hiển thị dưới dạng Grid Card đẹp mắt (gồm: ảnh xem trước, tiêu đề, tên Anime, số lượt tải, đánh giá sao, tác giả).
   - Có trạng thái đang tải (Loading) và khi không có hình nền nào phù hợp.
3. **Tìm kiếm & Lọc**:
   - Tìm kiếm hình nền theo tiêu đề (Title) hoặc tên bộ phim (Anime) trực tiếp từ ô search trên Header.
   - Lọc hình nền theo Danh mục (Categories) khi click vào các danh mục.
4. **Trang chi tiết hình nền (Detail Page)**:
   - Khi click vào một hình nền, chuyển hướng sang trang chi tiết (sử dụng `react-router-dom` hoặc hiển thị Modal chi tiết).
   - Hiển thị ảnh kích thước lớn, thông tin chi tiết: Tác giả, Độ phân giải, Lượt tải, Lượt thích, Mô tả chi tiết.
   - Nút **Tải về (Download)**: Khi click sẽ mở ảnh ở tab mới hoặc tự động tải ảnh về máy.

---

### Mức độ 2: Khá (Trung bình khá - Điểm 7-8)
1. **Trang quản trị (Admin Dashboard - CRUD)**:
   - Xây dựng một route riêng `/admin` hoặc giao diện chuyển đổi để quản lý.
   - Hiển thị bảng danh sách các hình nền (Table) có phân trang.
   - **Xóa hình nền (Delete)**: Có nút xóa hình nền, khi click cần hiển thị hộp thoại xác nhận (Confirm Modal) trước khi xóa thật khỏi API.
   - **Thêm mới hình nền (Create)**:
     - Thiết kế Form thêm mới hình nền.
     - Validate dữ liệu cơ bản: Tên không trống, đường dẫn ảnh bắt đầu bằng `/` hoặc `http`, độ phân giải phải chọn đúng định dạng (ví dụ: `1920x1080`, `3840x2160`).
     - Lưu dữ liệu thành công vào API thông qua phương thức `POST`.
   - **Chỉnh sửa hình nền (Update)**:
     - Cho phép click "Edit" trên dòng của bảng để tải thông tin cũ lên form và cập nhật thông tin qua phương thức `PUT`/`PATCH`.
2. **Phân trang (Pagination)**:
   - Phân trang cho danh sách hình nền ở trang chủ (ví dụ: tối đa 4 hoặc 6 ảnh trên 1 trang).

---

### Mức độ 3: Giỏi & Xuất sắc (Điểm 9-10)
1. **Hệ thống đánh giá & Bình luận (Reviews & Ratings)**:
   - Ở trang chi tiết hình nền, hiển thị các bình luận thuộc về hình nền đó (dựa vào `wallpaperId` trong bảng `comments`).
   - Form viết bình luận: Người dùng nhập tên, nội dung bình luận, và chọn số sao (1-5 sao).
   - Khi gửi bình luận thành công (`POST` lên `/comments`), hiển thị bình luận mới ngay lập tức mà không cần tải lại trang. Đồng thời cập nhật trung bình số sao (`rating`) của hình nền đó.
2. **Chức năng Hình nền yêu thích (Favorites/Wishlist)**:
   - Người dùng có thể click vào biểu tượng trái tim (Heart Icon) trên mỗi Card để thêm hình nền vào danh sách yêu thích.
   - Trạng thái yêu thích được lưu lại trong `localStorage` để không bị mất khi reload trang.
   - Có trang danh sách yêu thích `/favorites` hiển thị toàn bộ hình nền người dùng đã thích.
3. **Hiệu ứng & Thiết kế cao cấp (Premium UX)**:
   - Giao diện thiết kế theo phong cách hiện đại (Dark Mode hoặc Glassmorphism).
   - Hiệu ứng Hover mượt mà trên các thẻ hình nền (zoom nhẹ ảnh, xuất hiện nút download nhanh).
   - Animation chuyển trang mượt mà.

---

## 🚀 Hướng dẫn khởi chạy dự án

### Bước 1: Cài đặt các thư viện cần thiết
Mở Terminal tại thư mục dự án và chạy lệnh:
```bash
npm install react-router-dom axios
```
*(Hoặc bất kỳ thư viện icon nào bạn thích như `lucide-react`)*

### Bước 2: Chạy Mock API Server
Chúng ta sẽ dùng `json-server` để chạy API giả lập từ file `db.json`. Chạy lệnh sau trong một Terminal riêng:
```bash
npx json-server --watch db.json --port 4000
```
Sau khi chạy, bạn sẽ có các endpoint:
- Danh sách hình nền: `http://localhost:4000/wallpapers`
- Danh sách danh mục: `http://localhost:4000/categories`
- Danh sách bình luận: `http://localhost:4000/comments`

### Bước 3: Chạy ứng dụng React
Chạy lệnh sau tại thư mục dự án ở một Terminal khác:
```bash
npm start
```
Ứng dụng sẽ chạy tại địa chỉ: `http://localhost:3000`

---

## 🎨 Gợi ý thiết kế giao diện
- **Tone màu chủ đạo**: Nên dùng các màu sắc sang trọng, hiện đại như Neon Purple, Indigo, Dark Obsidian (nền tối) để làm nổi bật các bức ảnh anime rực rỡ.
- **Typography**: Sử dụng font chữ hiện đại như `Outfit` hoặc `Inter` bằng cách thêm vào `public/index.html`.
- **Card layout**: Có bo góc (`border-radius: 12px`), bóng đổ mờ (`box-shadow`), và hiệu ứng phóng to ảnh khi hover.

*Chúc bạn hoàn thành tốt bài tập thực hành này và tạo nên một sản phẩm thật ấn tượng!*
