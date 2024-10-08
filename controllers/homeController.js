const path = require("path");
const fs = require("fs");

const getHomePage = (req, res) => {
  // Query to get the top 4 documents
  const query = "SELECT * FROM documents ORDER BY id DESC LIMIT 4";

  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching documents:", err);
      return res.status(500).send("Database error");
    }

    // Read the home.html file
    fs.readFile(
      path.join(__dirname, "../views", "home.html"),
      "utf8",
      (err, htmlData) => {
        if (err) {
          console.error("Error reading HTML file:", err);
          return res.status(500).send("Error loading page");
        }

        let documentList = results
          .map(
            (doc) => `
        <div class="document-item">
            <a href="/document/${doc.id}}">
            <img alt="1" src="./images/file_img.png" />
            <div class="category"> Tài liệu ${doc.category}</div>
            <div class="name">${doc.name}</div>
            </a>
        </div>
      `
          )
          .join("");

        // Inject the document list into the HTML
        const modifiedHtml = htmlData.replace("{{documentList}}", documentList);

        // Send the modified HTML file to the client
        res.send(modifiedHtml);
      }
    );
  });
};

// const getDocumentDetailPage = (req, res) => {
//   const documentId = req.params.id;

//   // Truy vấn cơ sở dữ liệu để lấy thông tin chi tiết của tài liệu
//   const query = "SELECT * FROM documents WHERE id = ?";
//   connection.query(query, [documentId], (err, results) => {
//     if (err) {
//       console.error("Error fetching document details:", err);
//       return res.status(500).send("Database error");
//     }

//     if (results.length === 0) {
//       return res.status(404).send("Document not found");
//     }

//     const document = results[0];

//     // Đọc tệp detail.html
//     fs.readFile(
//       path.join(__dirname, "../views", "detail.html"),
//       "utf8",
//       (err, htmlData) => {
//         if (err) {
//           console.error("Error reading HTML file:", err);
//           return res.status(500).send("Error loading page");
//         }

//         // Thay thế các placeholder trong HTML với dữ liệu tài liệu
//         const modifiedHtml = htmlData
//           .replace("{{name}}", document.name)
//           .replace("{{description}}", document.description)
//           .replace("{{category}}", document.category)
//           .replace("{{path}}", document.path);

//         // Gửi trang chi tiết tài liệu tới client
//         res.send(modifiedHtml);
//       }
//     );
//   });
// };

// lấy 4 tài liệu mới nhất

const getDocumentDetailPage = (req, res) => {
  const documentId = req.params.id;

  // Truy vấn cơ sở dữ liệu để lấy thông tin chi tiết của tài liệu
  const query = "SELECT * FROM documents WHERE id = ?";
  connection.query(query, [documentId], (err, results) => {
    if (err) {
      console.error("Error fetching document details:", err);
      return res.status(500).send("Database error");
    }

    if (results.length === 0) {
      return res.status(404).send("Document not found");
    }

    const document = results[0];

    // Đọc tệp detail.html
    fs.readFile(
      path.join(__dirname, "../views", "detail.html"),
      "utf8",
      (err, htmlData) => {
        if (err) {
          console.error("Error reading HTML file:", err);
          return res.status(500).send("Error loading page");
        }

        // Thêm dữ liệu JSON của tài liệu vào phía client
        const script = `
          <script>
            const documentData = ${JSON.stringify(document)};
            document.addEventListener('DOMContentLoaded', () => {
              const container = document.querySelector('.document-container');
              container.innerHTML = \`
                <div class="category">
                  <h1>Tài liệu môn: \${documentData.category}</h1>
                </div>
                <div class="document-name">
                  <p>\${documentData.name}</p>
                </div>
                <div class="document-description">
                  <p>\${documentData.description}</p>
                </div> 
                <div class="document-download">
                  <a href="/\${documentData.path}" download class="download-btn">Download</a>
                </div>
              \`;
            });
          </script>
        `;

        // Thêm script vào cuối nội dung HTML
        const modifiedHtml = htmlData + script;

        // Gửi trang chi tiết tài liệu tới client
        res.send(modifiedHtml);
      }
    );
  });
};

const getLastDocuments = (req, res) => {
  const query = "SELECT * FROM documents ORDER BY id DESC LIMIT 4";
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Lỗi khi truy xuất dữ liệu từ MySQL:", err);
      return res.status(500).send("Lỗi khi truy xuất dữ liệu từ MySQL.");
    }
    res.json(results);
  });
};

module.exports = {
  getHomePage,
  getDocumentDetailPage,
  getLastDocuments,
};
