const express = require("express");
const path = require("path");
const session = require("express-session");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const cors = require("cors");

// Định tuyến cho các routes
const authRoutes = require("./routes/authRoutes");
const documentRoutes = require("./routes/documentRoutes");
const homeRoutes = require("./routes/homeRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
// Khởi tạo ứng dụng Express
const app = express();

// Thiết lập body-parser và thư mục tĩnh
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "views")));
app.use(express.static(path.join(__dirname)));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(
  cors({
    origin: "http://localhost:3000", // Thay bằng domain của bạn
    methods: ["GET", "POST"],
  })
);
// Cấu hình session
app.use(
  session({
    secret: "secret_key", // Thay bằng key bí mật của bạn
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Nếu dùng HTTPS, đặt thành true
  })
);

// Tạo kết nối MySQL
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  charset: "utf8mb4",
  password: "umntk000", // Đổi thành mật khẩu MySQL của bạn
  database: "documentDB",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Đã kết nối với cơ sở dữ liệu MySQL");
});

// Lưu kết nối vào biến toàn cục để sử dụng trong controller
global.connection = connection;

app.use("/", authRoutes);
app.use("/", documentRoutes);
app.use("/", homeRoutes);
app.use("/", categoryRoutes);

// Khởi động server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
