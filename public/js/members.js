$(document).ready(function() {
  // This file just does a GET request to figure out which user is logged in
  // and updates the HTML on the page
  $.get("/api/user_data").then(function(data) {
    $(".member-name").text(data.email);
  });
});

// post req for user job selections
$("#saveButton").on("click", function() {
  $.get("/api/:id").then(function(DBData) {
    $(DBData[data].id).append("/api/user");
  });
});
