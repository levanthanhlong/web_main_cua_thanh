const express = require("express");
const router = express.Router();
const homeController = require("../controllers/homeController");

router.get("/", homeController.getHomePage);
router.get("/document/:id", homeController.getDocumentDetailPage);

// Route để lấy 4 tài liệu mới nhất
router.get("/api/documents/latest", homeController.getLastDocuments);



module.exports = router;
