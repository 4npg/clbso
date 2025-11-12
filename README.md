# 🎭 S.O.W Club Website

Website chính thức của Câu lạc bộ múa S.O.W (Soul On Wings) - Bao gồm trang quảng bá công khai và hệ thống quản lý nội bộ.

## 📋 Mục lục

- [Tính năng](#tính-năng)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Cài đặt](#cài-đặt)
- [Cấu hình](#cấu-hình)
- [Chạy dự án](#chạy-dự-án)
- [Triển khai](#triển-khai)
- [Cấu trúc dự án](#cấu-trúc-dự-án)

## ✨ Tính năng

### Trang công khai
- 🏠 **Trang chủ**: Giới thiệu CLB với banner và thông tin nổi bật
- 📖 **Giới thiệu**: Câu chuyện, sứ mệnh và tầm nhìn của CLB
- 🖼️ **Thư viện ảnh**: Gallery với filter theo danh mục
- 👥 **Thành viên**: Danh sách thành viên với thông tin chi tiết
- 📅 **Lịch hoạt động**: Các sự kiện, buổi tập và biểu diễn

### Hệ thống nội bộ
- 🔐 **Đăng nhập**: Xác thực bằng Firebase Auth (Google)
- 📊 **Dashboard**: Tổng quan hoạt động và thống kê
- 📝 **Báo cáo**: Quản lý báo cáo công việc
- 📅 **Lịch rảnh**: Tích hợp Google Forms để điền lịch rảnh
- 💰 **Thu - Chi**: Quản lý tài chính với thống kê chi tiết
- 🖼️ **Ảnh nội bộ**: Upload và quản lý ảnh với Firebase Storage

## 🛠️ Công nghệ sử dụng

### Frontend
- **React 18** - UI Framework
- **React Router DOM** - Routing
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **AOS** - Scroll animations
- **Firebase** - Authentication & Storage
- **Axios** - HTTP Client

### Backend
- **Node.js** - Runtime
- **Express** - Web Framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Firebase Admin** - Server-side Firebase

## 📦 Cài đặt

### Yêu cầu
- Node.js >= 16.x
- MongoDB (local hoặc MongoDB Atlas)
- Firebase project

### Bước 1: Clone repository
```bash
git clone <repository-url>
cd sow-club-website
```

### Bước 2: Cài đặt dependencies
```bash
# Cài đặt tất cả dependencies
npm run install-all

# Hoặc cài đặt riêng lẻ
npm install
cd server && npm install
cd ../client && npm install
```

## ⚙️ Cấu hình

### Backend (.env)
Tạo file `server/.env` từ `server/.env.example`:

```env
MONGODB_URI=mongodb://localhost:27017/sow-club
JWT_SECRET=your-super-secret-jwt-key
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY=your-firebase-private-key
FIREBASE_CLIENT_EMAIL=your-firebase-client-email
PORT=5000
```

### Frontend (.env)
Tạo file `client/.env` từ `client/.env.example`:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_FIREBASE_API_KEY=your-firebase-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
REACT_APP_GOOGLE_FORM_URL=https://forms.gle/your-form-id
```

### Firebase Setup
1. Tạo project mới trên [Firebase Console](https://console.firebase.google.com)
2. Bật Authentication với Google Provider
3. Tạo Storage bucket
4. Lấy credentials và điền vào file `.env`

## 🚀 Chạy dự án

### Development Mode
```bash
# Chạy cả frontend và backend
npm run dev

# Hoặc chạy riêng lẻ
npm run server  # Backend trên port 5000
npm run client  # Frontend trên port 3000
```

### Production Build
```bash
# Build frontend
cd client
npm run build

# Chạy backend
cd server
npm start
```

## 🌐 Triển khai

### Frontend (Vercel/Netlify)
1. Kết nối repository với Vercel/Netlify
2. Cấu hình environment variables
3. Build command: `cd client && npm install && npm run build`
4. Publish directory: `client/build`

### Backend (Render/Railway)
1. Kết nối repository
2. Root directory: `server`
3. Build command: `npm install`
4. Start command: `npm start`
5. Cấu hình environment variables

### Domain
- Mua domain tại Namecheap/Google Domains
- Cấu hình DNS trỏ về Vercel/Netlify (frontend)
- Cấu hình CORS trên backend để cho phép domain mới

## 📁 Cấu trúc dự án

```
sow-club-website/
├── client/                 # Frontend React
│   ├── public/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/        # Page components
│   │   ├── context/      # React Context
│   │   ├── config/       # Configuration files
│   │   └── App.js
│   └── package.json
├── server/                # Backend Node.js
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middleware/       # Middleware functions
│   ├── index.js          # Entry point
│   └── package.json
├── package.json          # Root package.json
└── README.md
```

## 📝 API Endpoints

### Public
- `GET /api/members` - Lấy danh sách thành viên
- `GET /api/events` - Lấy danh sách sự kiện
- `GET /api/gallery` - Lấy thư viện ảnh

### Authenticated
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/me` - Lấy thông tin user hiện tại
- `GET /api/reports` - Lấy báo cáo
- `POST /api/reports` - Tạo báo cáo
- `GET /api/finance` - Lấy thu chi
- `POST /api/finance` - Thêm thu chi
- `GET /api/finance/stats` - Thống kê tài chính

### Admin Only
- `POST /api/members` - Tạo thành viên
- `POST /api/events` - Tạo sự kiện
- `PUT /api/finance/:id` - Duyệt thu chi

## 🤝 Đóng góp

1. Fork dự án
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📄 License

Dự án này thuộc về S.O.W Club.

## 👥 Tác giả

S.O.W Club - Soul On Wings

---

Made with ❤️ by S.O.W Club

