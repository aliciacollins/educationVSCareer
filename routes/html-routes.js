// Requiring path to so we can use relative routes to our HTML files
// var path = require("path");

// Requiring our custom middleware for checking if a user is logged in
var isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function(app) {
  app.get("/", function(req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/members");
    } else {
      res.render("signup");
    }
  });

  app.get("/login", function(req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/members");
    } else {
      res.render("login");
    }
    // res.sendFile(path.join(__dirname, "../public/login.html"));
  });

  // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be redirected to the signup page
  app.get("/members", isAuthenticated, function(req, res) {
    res.render("index");
  });

  // HTML routes for user form

  function validateForm() {
    var a = document.forms.Form.answer_a.value;
    var b = document.forms.Form.answer_b.value;
    var c = document.forms.Form.answer_c.value;
    if (
      (a === null || a === "",
      OR,
      b === null || b === "",
      OR,
      c === null || c === "")
    ) {
      alert("Please Fill Out Fields");
      return false;
    }
  }
  app.get("/form", function(req, res) {
    validateForm();
    res.sendFile(path.join(__dirname, "../public/index.html"));
  });

  // HTML route for charts
  app.get("/charts", function(req, res) {
    res.render("charts");
  });
};
