const path = require("path");
const fs = require("fs");
// Hiển thị trang admin
const getAdminPage = (req, res) => {
  res.sendFile(path.join(__dirname, "../views", "admin.html"));
};

// Hiển thị trang upload tài liệu
const getUploadPage = (req, res) => {
  res.sendFile(path.join(__dirname, "../views", "upload.html"));
};

// Hiển thị trang edit tài liệu
const getEditPage = (req, res) => {
  res.sendFile(path.join(__dirname, "../views", "edit.html"));
};

// Xử lý việc upload tài liệu
const uploadDocument = (req, res) => {
  const { name, description, category } = req.body;
  const filePath = path.join("uploads", req.file.filename);

  const query =
    "INSERT INTO documents (name, description, category, path) VALUES (?, ?, ?, ?)";
  global.connection.execute(
    query,
    [name, description, category, filePath],
    (err, results) => {
      if (err) {
        return res.status(500).send("Lỗi khi lưu dữ liệu vào MySQL");
      }
      res.redirect("/admin");
    }
  );
};

// Xoá tài liệu bằng id
const deleteDocument = (req, res) => {
  const documentId = req.params.id;

  // Trước tiên, lấy đường dẫn file để xóa file khỏi hệ thống
  const selectQuery = "SELECT path FROM documents WHERE id = ?";
  connection.query(selectQuery, [documentId], (err, results) => {
    if (err) {
      return res.status(500).send("Lỗi khi truy xuất dữ liệu từ MySQL");
    }
    if (results.length === 0) {
      return res.status(404).send("Tài liệu không tồn tại");
    }

    const filePath = results[0].path;

    // Xóa file khỏi hệ thống file
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Lỗi khi xóa file:", err);
        // Không trả về lỗi cho người dùng, tiếp tục xóa bản ghi
      }

      // Xóa bản ghi khỏi cơ sở dữ liệu
      const deleteQuery = "DELETE FROM documents WHERE id = ?";
      connection.execute(deleteQuery, [documentId], (err, results) => {
        if (err) {
          return res.status(500).send("Lỗi khi xóa dữ liệu từ MySQL");
        }
        res.status(200).send("Xóa thành công");
      });
    });
  });
};

// Lấy danh sách tài liệu từ MySQL
const getDocuments = (req, res) => {
  const query = "SELECT * FROM documents";
  global.connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).send("Lỗi khi truy xuất dữ liệu từ MySQL");
    }
    res.json(results);
  });
};

// Lấy thông tin chi tiết một tài liệu cụ thể bằng id
const getDocumentbyID = (req, res) => {
  const documentId = req.params.id;
  const query = "SELECT * FROM documents WHERE id = ?";
  connection.query(query, [documentId], (err, results) => {
    if (err) {
      return res.status(500).send("Lỗi khi truy xuất dữ liệu từ MySQL");
    }
    if (results.length === 0) {
      return res.status(404).send("Tài liệu không tồn tại");
    }
    res.json(results[0]);
  });
};

// Update document
const updateDocument = (req, res) => {
  const documentId = req.params.id;
  const { name, description, category } = req.body;
  let filePath = null;

  // Kiểm tra xem có file mới được tải lên không
  if (req.file) {
    filePath = path.join("uploads", req.file.filename);
  }

  // Trước tiên, lấy đường dẫn file hiện tại để xóa nếu có file mới được tải lên
  const selectQuery = "SELECT path FROM documents WHERE id = ?";
  connection.query(selectQuery, [documentId], (err, results) => {
    if (err) {
      return res.status(500).send("Lỗi khi truy xuất dữ liệu từ MySQL");
    }
    if (results.length === 0) {
      return res.status(404).send("Tài liệu không tồn tại");
    }

    const oldFilePath = results[0].path;

    if (filePath) {
      // Nếu có file mới, xóa file cũ
      fs.unlink(oldFilePath, (err) => {
        if (err) {
          console.error("Lỗi khi xóa file cũ:", err);
          // Không trả về lỗi cho người dùng, tiếp tục cập nhật bản ghi
        }

        // Cập nhật bản ghi trong cơ sở dữ liệu với file mới
        const updateQuery =
          "UPDATE documents SET name = ?, description = ?, category = ?, path = ? WHERE id = ?";
        connection.execute(
          updateQuery,
          [name, description, category, filePath, documentId],
          (err, results) => {
            if (err) {
              return res.status(500).send("Lỗi khi cập nhật dữ liệu vào MySQL");
            }
            res.status(200).send("Cập nhật thành công");
          }
        );
      });
    } else {
      // Nếu không có file mới, chỉ cập nhật các trường khác
      const updateQuery =
        "UPDATE documents SET name = ?, description = ?, category = ? WHERE id = ?";
      connection.execute(
        updateQuery,
        [name, description, category, documentId],
        (err, results) => {
          if (err) {
            return res.status(500).send("Lỗi khi cập nhật dữ liệu vào MySQL");
          }
          res.status(200).send("Cập nhật thành công");
        }
      );
    }
  });
};

module.exports = {
  getAdminPage,
  getDocuments,
  uploadDocument,
  getUploadPage,
  deleteDocument,
  updateDocument,
  getDocumentbyID,
  getEditPage,
};
