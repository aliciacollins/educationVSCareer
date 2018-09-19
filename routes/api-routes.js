// Requiring our models and passport as we've configured it
var db = require("../models");
var passport = require("../config/passport");

module.exports = function (app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), function (req, res) {
    // Since we're doing a POST with javascript, we can't actually redirect that post into a GET request
    // So we're sending the user back the route to the members page because the redirect will happen on the front end
    // They won't get this or even be able to access this page if they aren't authed
    res.json("/members");
  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/signup", function (req, res) {
    console.log(req.body);
    db.User.create({
      email: req.body.email,
      password: req.body.password
    })
      .then(function () {
        res.redirect(307, "/api/login");
      })
      .catch(function (err) {
        console.log(err);
        res.json(err);
        // res.status(422).json(err.errors[0].message);
      });
  });

  // Route for logging user out
  app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
  });

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", function (req, res) {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        email: req.user.email,
        id: req.user.id,
        userInfo: req.user.userInfo
      });
    }
  });

  // Route for saving user job selections
  app.post("/api/form", function (req) {
    console.log(req.body);
    db.User.append({
      UserInfo: req.body.userInfo
    });
  });
  // Route for  getting user job selections
  app.get("/api/form", function (req, res) {
    db.user
      .findAll({
        group: "userInfo"
      })
      .then(function (data) {
        return res.json(data);
      });
  });

  // show form
  app.get("/api/popCategory", function (req, res) {
    db.jobs
      .findAll({
        group: "category"
      })
      .then(function (data) {
        return res.json(data);
      });
  });

  app.get("/api/popAsCode", function (req, res) {
    db.jobs
      .findAll({
        group: "asCode"
      })
      .then(function (data) {
        return res.json(data);
      });
  });

  app.get("/api/poptypicalEntryLevelEducation", function (req, res) {
    db.jobs
      .findAll({
        group: "educationCode"
      })
      .then(function (data) {
        return res.json(data);
      });
  });

  app.get("/api/savedJobs/:userId?", function (req, res) {
    db.User.findOne({
      where: { id: req.params.userId }
    }).then(function (data) {
      return res.json(data.userInfo);
    });
  });

  app.get("/api/findJob/:jobId?", function (req, res) {
    db.jobs.findOne({
      where: { id: req.params.jobId }
    }).then(function (data) {
      return res.json(data);
    });
  });

  app.post("/api/addUserSelection", function (req) {
    var data = req.body;
    console.log(data);

    if (req.body.length !== 0) {
      db.User.findOne({
        where: {
          email: data.user
        }
      }).then(function (dbUser) {
        var addId = data.selectionID;
        var pushInfo;
        if (dbUser.userInfo == null || dbUser.userInfo.trim() === "") {
          pushInfo = addId;
          db.User.update(
            { userInfo: pushInfo },
            { where: { email: dbUser.email } }
          );
        } else {
          var userInfoArray = [];
          userInfoArray = dbUser.userInfo.split(",");
          if (userInfoArray.indexOf(addId) !== -1) {
            console.log("Selection already in array");
          } else {
            userInfoArray.push(addId);
            pushInfo = userInfoArray.join(",");
            db.User.update(
              { userInfo: pushInfo },
              { where: { email: dbUser.email } }
            );
          }
        }
      });
    }
  });

  app.post("/api/subUserSelection", function (req) {
    var data = req.body;
    console.log(data);

    if (req.body.length !== 0) {
      db.User.findOne({
        where: {
          email: data.user
        }
      }).then(function (dbUser) {
        var subId = data.selectionID;
        console.log(dbUser.userInfo);
        var pushInfo;
        var userInfoArray = dbUser.userInfo.split(",");
        if (userInfoArray.indexOf(subId) === -1) {
          console.log("Deletion not in the array");
        } else {
          userInfoArray.splice(userInfoArray.indexOf(subId), 1);
          console.log(userInfoArray);
          pushInfo = userInfoArray.join(",");
          db.User.update(
            { userInfo: pushInfo },
            { where: { email: dbUser.email } }
          );
        }



      });
    }
  });

  app.get("/api/charts", function (req, res) {
    res.json("/charts");
  });


  app.get("/api/:category/:asCode/:typicalEntryLevelEducation", function (
    req,
    res
  ) {
    // get all fields
    var category = req.params.category;
    var asCode = req.params.asCode;
    var typicalEntryLevelEducation = req.params.typicalEntryLevelEducation;

    switch (true) {
      case category === "Search All" &&
        asCode === "Search All" &&
        typicalEntryLevelEducation === "Search All": {
          db.jobs.findAll({ where: {} }).then(function (dbjobs) {
            return res.json(dbjobs);
          });
          break;
        }
      case category === "Search All" && asCode === "Search All": {
        db.jobs
          .findAll({
            where: { typicalEntryLevelEducation: typicalEntryLevelEducation }
          })
          .then(function (dbjobs) {
            return res.json(dbjobs);
          });
        break;
      }
      case category === "Search All" &&
        typicalEntryLevelEducation === "Search All": {
          db.jobs
            .findAll({
              where: { asCode: asCode }
            })
            .then(function (dbjobs) {
              return res.json(dbjobs);
            });
          break;
        }
      case asCode === "Search All" &&
        typicalEntryLevelEducation === "Search All": {
          db.jobs
            .findAll({
              where: { category: category }
            })
            .then(function (dbjobs) {
              return res.json(dbjobs);
            });
          break;
        }
      case category === "Search All": {
        db.jobs
          .findAll({
            where: {
              typicalEntryLevelEducation: typicalEntryLevelEducation,
              asCode: asCode
            }
          })
          .then(function (dbjobs) {
            return res.json(dbjobs);
          });
        break;
      }
      case asCode === "Search All": {
        db.jobs
          .findAll({
            where: {
              category: category,
              typicalEntryLevelEducation: typicalEntryLevelEducation
            }
          })
          .then(function (dbjobs) {
            return res.json(dbjobs);
          });
        break;
      }
      case typicalEntryLevelEducation === "Search All": {
        db.jobs
          .findAll({
            where: {
              category: category,
              asCode: asCode
            }
          })
          .then(function (dbjobs) {
            return res.json(dbjobs);
          });
        break;
      }
      default: {
        db.jobs
          .findAll({
            where: {
              typicalEntryLevelEducation: typicalEntryLevelEducation,
              category: category,
              asCode: asCode
            }
          })
          .then(function (dbjobs) {
            return res.json(dbjobs);
          });
      }
    }
  });
};