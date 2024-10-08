const path = require("path");

const getLoginPage = (req, res) => {
  res.sendFile(path.join(__dirname, "../views", "login.html"));
};

const getAdminPage = (req, res) => {
  res.sendFile(path.join(__dirname, "../views", "admin.html"));
};

const login = (req, res) => {
  const { username, password } = req.body;
  if (username === "thanh" && password === "thanh2003") {
    req.session.loggedin = true;
    req.session.username = username;
    res.redirect("/admin");
  } else {
    res.redirect("/login?error=invalid_credentials");
  }
};

const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return console.log(err);
    }
    res.redirect("/login");
  });
};

const requireLogin = (req, res, next) => {
  if (req.session.loggedin) {
    next();
  } else {
    res.redirect("/login");
  }
};

// Export tất cả các hàm điều khiển
module.exports = {
  getLoginPage,
  login,
  logout,
  requireLogin,
  getAdminPage,
};
