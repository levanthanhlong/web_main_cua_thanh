// routes/documentRoutes.js
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// Route để lấy tài liệu theo danh mục
router.get('/documents/category', categoryController.getDocumentsByCategory);

// Route mặc định để phục vụ category.html
router.get('/category.html', (req, res) => {
 categoryController.getCategoryPage
});

module.exports = router; 
