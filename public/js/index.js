// Click events for the submit button
$(document).ready(function () {
  // This file just does a GET request to figure out which user is logged in
  // and updates the HTML on the page
  $.get("/api/user_data").then(function (user) {
    $("#member-name").text(user.email);
    $.get("/api/savedJobs/" + user.id).then(function (userData) {
      if (userData == "" || userData == null) {
        console.log("No saved jobs");
      } else {
        var jobsArray = userData.split(",");
        $("#savedTitle").text("Saved Jobs");
        $("#savedHeader").css("display", "table-row");
        $("#compare").css("display", "inherit");
        for (job in jobsArray) {
          $.get("/api/findJob/" + jobsArray[job]).then(function (dbData) {
            var newRow = $("<tr>");
            $(newRow).append(
              "<td class='clear'><button class='btn' id='" +
              dbData.id +
              "'><i class='fas fa-minus'></i> Clear</button>" +
              "</td>"
            );
            $(newRow).append(
              "<td id='oT" +
              dbData.id +
              "'>" +
              dbData.abbreviatedName +
              "</td>"
            );
            // the annual catagory
            $(newRow).append("<td>" + dbData.category + "</td>");
            // the annual wage"
            $(newRow).append("<td>" + dbData.medianAnnualWage + "</td>");
            // append the education requirement
            $(newRow).append(
              "<td>" + dbData.typicalEntryLevelEducation + "</td>"
            );
            // the employment level 2016
            $(newRow).append(
              "<td>" + dbData.employment2016Thousands + "</td>"
            );
            // the 10 yr employment change
            $(newRow).append(
              "<td>" + dbData.employmentChange20162026Percent + "</td>"
            );
            // append the work experience
            $(newRow).append(
              "<td>" + dbData.workExperienceInARelatedOccupation + "</td>"
            );
            // append the job training
            $(newRow).append(
              "<td>" + dbData.TypicalOnTheJobTraining + "</td>"
            );
            // $("#resultSection").append(newRow);
            $("#savedSection").append(newRow);
          });
        }

      }
    });
  });

  $.get("/api/popCategory").then(function (dbData) {
    for (data in dbData) {
      $("#category-search").append(
        "<option>" + dbData[data].category + "</option>"
      );
    }
  });

  $.get("/api/popAsCode").then(function (dbData) {
    for (data in dbData) {
      $("#salary-search").append(
        "<option>" + dbData[data].asCode + "</option>"
      );
    }
  });

  $.get("/api/poptypicalEntryLevelEducation").then(function (dbData) {
    for (data in dbData) {
      $("#education-search").append(
        "<option>" + dbData[data].typicalEntryLevelEducation + "</option>"
      );
    }
  });
});

$("#logout").on("click", function () {
  console.log("Logging out....");
  $.get("/logout/", function () {
    window.location.href = "/";
  });
});

// user subission click request
$("#submit").on("click", function (e) {
  e.preventDefault();
  var searchedCategory = $("#category-search")
    .val()
    .trim();
  var searchedSalary = $("#salary-search")
    .val()
    .trim();
  var searchedEducation = $("#education-search")
    .val()
    .trim();
  // get request from database
  $.get(
    "/api/" + searchedCategory + "/" + searchedSalary + "/" + searchedEducation,
    function (dbData) {
      // log the data to our console
      // empty to resultSection before adding new content
      $("#resultSection").empty();
      // if the data is not there, then return an error message
      if (!dbData[0]) {
        $("#resultSection").append(
          "<h2> No results found. Please change selections </h2>"
        );
      } else {
        // otherwise
        //add column headers
        $("#resultTitle").text("Results");

        var head = $("<thead>");
        var row = $("<tr>");
        $(row).append("<th scope='col'>Add to Comparison</th>");
        $(row).append("<th scope='col'>Occupation</th>");
        $(row).append("<th scope='col'>Category</th>");
        $(row).append("<th scope='col'>Median Annual Wage</th>");
        $(row).append("<th scope='col'>Typcal Entry Level Eduction</th>");
        $(row).append("<th scope='col'>Employment In 1000s (2016)</th>");
        $(row).append(
          "<th scope='col'>Employment Change 10 Year Projection</th>"
        );
        $(row).append(
          "<th scope='col'>Work Experience In Related Occupation</th>"
        );
        $(row).append("<th scope='col'>Typical On The Job Training</th>");
        $(head).append(row);
        $("#resultSection").append(head);
        $("#resultSection").append("<tbody>");

        // append the ocupation name
        for (data in dbData) {
          // console.log(dbData[data]);
          var newRow = $("<tr>");
          $(newRow).append(
            "<td class='add'><button class='btn' id='" +
            dbData[data].id +
            "'><i class='fas fa-plus'></i> Add</button>" +
            "</td>"
          );
          $(newRow).append(
            "<td id='oT" +
            dbData[data].id +
            "'>" +
            dbData[data].abbreviatedName +
            "</td>"
          );
          // the annual catagory
          $(newRow).append("<td>" + dbData[data].category + "</td>");
          // the annual wage"
          $(newRow).append("<td>" + dbData[data].medianAnnualWage + "</td>");
          // append the education requirement
          $(newRow).append(
            "<td>" + dbData[data].typicalEntryLevelEducation + "</td>"
          );
          // the employment level 2016
          $(newRow).append(
            "<td>" + dbData[data].employment2016Thousands + "</td>"
          );
          // the 10 yr employment change
          $(newRow).append(
            "<td>" + dbData[data].employmentChange20162026Percent + "</td>"
          );
          // append the work experience
          $(newRow).append(
            "<td>" + dbData[data].workExperienceInARelatedOccupation + "</td>"
          );
          // append the job training
          $(newRow).append(
            "<td>" + dbData[data].TypicalOnTheJobTraining + "</td>"
          );
          // $("#resultSection").append(newRow);
          $("#resultSection").append(newRow);
        }

      }
    }
  );
});

$("#resultSection").on("click", function (e) {
  e.preventDefault();
  if (e.target.className === "btn") {
    var count = $("#savedSection")[0].rows.length;
    if (count > 5) {
      alert("Please limit your selections to 5 jobs");
    } else {
      $("#savedTitle").text("Saved Jobs");
      $("#savedHeader").css("display", "table-row");
      $("#compare").css("display", "inherit");
      $(e.target).text("clear");
      var row = $(e.target).parent().parent()[0].outerHTML;
      $("#savedSection").append(row);
      $(e.target).parent().parent().remove();
      selectionID = e.target.id;
      var user = $("#member-name").text();
      var userValues = {
        user: user,
        selectionID: selectionID

      };
      $.post("/api/addUserSelection", userValues);
    }
  }
});

$("#savedSection").on("click", function (e) {
  e.preventDefault();
  if (e.target.className === "btn") {
    $(e.target).text("add");
    // var row = $(e.target).parent().parent()[0].outerHTML;
    // $("#resultSection").prepend(row);
    $(e.target).parent().parent().remove();
    selectionID = e.target.id;
    var user = $("#member-name").text();
    var userValues = {
      user: user,
      selectionID: selectionID

    };
    var count = $("#savedSection")[0].rows.length;
    if (count <= 1) {
      $("#savedTitle").text("");
      $("#savedHeader").css("display", "none");
      $("#compare").css("display", "none");
    }
    $.post("/api/subUserSelection", userValues);

  }
});

$("#compare").on("click", function () {
    window.location.assign("/charts");
});
