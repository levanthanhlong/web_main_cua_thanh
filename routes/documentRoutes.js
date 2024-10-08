const express = require("express");
const router = express.Router();
const multer = require("multer");
const documentController = require("../controllers/documentController");
const authController = require("../controllers/authController");

// Cấu hình thư mục lưu file tài liệu
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });
const editUpload = multer({ storage: storage });

// Định nghĩa các route
router.get(
  "/upload",
  authController.requireLogin,
  documentController.getUploadPage
);
router.post(
  "/upload",
  authController.requireLogin,
  upload.single("file"),
  documentController.uploadDocument
);
router.get(
  "/api/documents",
  authController.requireLogin,
  documentController.getDocuments
);

// Route để xóa tài liệu
router.delete(
  "/api/documents/:id",
  authController.requireLogin,
  documentController.deleteDocument
);

// Route để cập nhật thông tin tài liệu
router.put(
  "/api/documents/:id",
  authController.requireLogin,
  editUpload.single("file"), // Sử dụng Multer để xử lý file nếu có
  documentController.updateDocument
);

// Route để lấy thông tin một tài liệu cụ thể
router.get(
  "/api/documents/:id",
  authController.requireLogin,
  documentController.getDocumentbyID
);

// Route để hiển thị trang chỉnh sửa
router.get(
  "/edit/:id",
  authController.requireLogin,
  documentController.getEditPage
);

module.exports = router;
