const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.get("/login", authController.getLoginPage);
router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.get("/admin", authController.requireLogin, authController.getAdminPage);

module.exports = router;
