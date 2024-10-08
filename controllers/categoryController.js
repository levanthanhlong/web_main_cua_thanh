// Hàm để lấy tài liệu theo danh mục
const getDocumentsByCategory = (req, res) => {
  const category = req.query.category;

  if (!category) {
    return res.status(400).json({ error: "Category is required" });
  }

  const query = "SELECT * FROM documents WHERE category = ?";

  connection.query(query, [category], (err, results) => {
    if (err) {
      console.error("Error querying the database:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    res.json(results);
  });
};

const getCategoryPage = (req, res) => {
  res.sendFile(path.join(__dirname, "views", "category.html"));
};

module.exports = {
  getDocumentsByCategory,
  getCategoryPage,
};
