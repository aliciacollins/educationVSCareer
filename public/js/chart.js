 var jobsTitle = [];
 var jobsMedian = [];
 var jobsEducation = [];

$(document).ready(function () {
  $.get("/api/user_data").then(function (user) {
    console.log(user);
    $.get("/api/savedJobs/" + user.id).then(function (userData) {
      if (userData == "" || userData == null) {
        console.log("No saved jobs");
      } else {
        var jobsArray = userData.split(",");
        console.warn("jobsArray",jobsArray);
        for (job in jobsArray) {
          $.get("/api/findJob/" + jobsArray[job]).then(function (dbData) {
            jobsTitle.push(dbData.abbreviatedName);
            jobsMedian.push(dbData.medianAnnualWage);
            jobsEducation.push(dbData.educationCode);
          });
        }
        return(jobsTitle,jobsMedian,jobsEducation);
      }
    });
  });
});


console.log("jobsTitle",jobsTitle);
console.log("jobsMedian",jobsMedian);
console.log("jobsEducation",jobsEducation);
 
var infoArray1 = [jobsEducation,jobsMedian, jobsTitle];
var infoArray2 = [2,250000,"job number 2"];
var infoArray3 = [7,60000,"job number 3"];

console.log("info array",infoArray1);


// variabes to feed graphs, 
//    amount of schooling - approximate student loan amount
//    median wage
//    job discription - label


// variables array
//    [years of education, median salary, job title]
//>7 no cost, 1 doctorate, 2 masters, 3 bachelors, 4 associate, 5-6 some college

// [educationCode,medianAnnualWage,abbreviatedName]



 var educationCode = infoArray1[0];


var iRate = 6.5 / 1200;
  var iMonths = 360;
  var remainingBalance = [];
  var years = [];
  var loanAmount = "";
  var StdLoanBalance = [];

function convertEdCode(){
  alert("ed code");
  
if (educationCode == 1){
  loanAmount = 200000;
}
else if (educationCode == 2){
  loanAmount = 120000;
}
else if (educationCode === 3){
  loanAmount = 80000;
}
else if (educationCode === 4){
  loanAmount = 15000;
}
else if (educationCode === 5 || 6){
  loanAmount = 5000;
}
   
return loanAmount;


}

convertEdCode(educationCode);
console.log("ed code is", educationCode);
// calculations for student loan amount
  console.log("loan amount",loanAmount);
  
//   function f1() {
//     alert("f1 called");
//     //form validation that recalls the page showing with supplied inputs.    
// }
// window.onload = function() {
//     document.getElementById("button1").onclick = function fun() {
//         console.log("button was hit");
//         f1();
//         //validation code to see State field is mandatory.  
//     };
// };
  
 
  function getMonthlyPayment(balance, iRate, iMonths) {
    return (
      balance *
      ((iRate * Math.pow(1 + iRate, iMonths)) /
        (Math.pow(1 + iRate, iMonths) - 1))
    );
  }

  //calculate monthly payment and change to two decimal places
  monthlyPayment = getMonthlyPayment(loanAmount, iRate, iMonths).toFixed(2);
  console.log(monthlyPayment);
  //montlyPayment rounded up and to two decimal places

  interest = (monthlyPayment * iMonths - loanAmount).toFixed(2);

  console.log("interest", interest);
  //create arrays to push into charts
  var bal = loanAmount;
  for (var p = 1; p <= iMonths; p++) {
    var thisMonthsInterest = bal * iRate;
    bal -= monthlyPayment - thisMonthsInterest;
    remainingBalance.push(bal);
  }

  for (var i = 0; i < iMonths; i += 12) {
    StdLoanBalance.push(remainingBalance[i]);
  }

  //change months to years

  for (var x = 0; x <= iMonths; x += 12) {
    years.push(x / 12);
  }
  console.log("years", years);
  console.log("StdLoanBalance", StdLoanBalance);
  console.log("interest", interest);
  console.log("monthly payment", monthlyPayment);
  console.log(
    "percent",
    (interest / (interest + loanAmount)) * 100,
    (loanAmount / (interest + loanAmount)) * 100
  );

  //set values to two decimal places

  StdLoanBalance = StdLoanBalance.map(function (eachElement) {
    return Number(eachElement.toFixed(2));
  });
  
  
  var medSalaries = [];
  var median = infoArray1[1];
  median = median * 0.8;

  for (var i = 0; i <= 30; i++) {
    median = median * 1.03729;
    medSalaries.push(median);
  }

  // console.log("med array", medSalaries);

  var medSalaries2 = [];
  var median2 = infoArray2[1];
  median2 = median2 * 0.5;
  //create a for each function
  for (var i = 0; i <= 30; i++) {
    median2 = median2 * 1.0372;
    medSalaries2.push(median2);
  }
 
  var medSalaries3 = [];
  var median3 = infoArray3[1];
  median3 = median3 * 0.5;

  for (var i = 0; i <= 30; i++) {
    median3 = median3 * 1.038;
    medSalaries3.push(median3);
  }
  for (var x = 0; x <= years; x += 5) {
    years.push(x);
  }

  //create a for each function

  // console.log("mediansalarys", medSalaries);
  // console.log("mediansalarys2", medSalaries2);
  // console.log("mediansalarys3", medSalaries3);


  ///displaying graphs
  var pieChartData = {
    labels: ["Interest Paid", "Amount Borrowed"],
    datasets: [
      {
        label: ["Interest Paid", "Amount Borrowed"],
        backgroundColor: [
          "rgba(179,124,87,.4)",
          "rgba(154,172,184,.4)",
          "rgba(60,69,92,.4)"
        ],
        data: [interest, loanAmount]
      }
    ],
    options: {
      pieceLabel: {
        render: "value"
      }
    }
  };

  var StdLoanData = {
    labels: years,
    datasets: [
      {
        label: "Student Loan Payment",
        backgroundColor: "rgba(60,69,92,0.4)",
        data: StdLoanBalance
      }
    ]
  };
  var comparisonData = {
    labels: years,
    datasets: [
      {
        label: infoArray1[2],
        data: medSalaries3,
        backgroundColor: "rgba(179,124,87,.4)"
      },
      {
        label: "Student Loan Balance ",
        data: StdLoanBalance,
        backgroundColor: "rgba(60,69,92,0.4)"
      }
    ],
    options: {
      pieceLabel: {
        render: "value"
      }
    }
  };
  var medianData = {
    labels: years,
    datasets: [
      {
        label: infoArray1[2],
        data: medSalaries,
        backgroundColor: "rgba(179,124,87,.7)",
        fill: false
      },
      {
        label: infoArray2[2],
        data: medSalaries2,
        backgroundColor: "rgba(60,69,92,0.7)",
        fill: false
      },
      {
        label: infoArray3[2],
        data: medSalaries3,
        backgroundColor: "rgba(96,65,43,0.7)",
        fill: false
      }
    ],
    options: {
      pieceLabel: {
        render: "value"
      }
    }
  };

  window.onload = function () {
    var ctx = document.getElementById("canvas1").getContext("2d");
    window.myBar = new Chart(ctx, {
      type: "pie",
      data: pieChartData,
      options: {
        responsive: true,
        title: {
          display: true,
          text: "Cost of Your Education"
        }
      }
    });

    var ctx2 = document.getElementById("canvas2").getContext("2d");
    window.myBar = new Chart(ctx2, {
      type: "line",
      data: StdLoanData,
      options: {
        responsive: true,
        title: {
          display: true,
          text: "Student Loan Interest Paid vs. Amount Borrowed"
        },
        scales: {
          axisX: {
            lable: iMonths
          },

          yAxes: [
            {
              type: "linear", // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
              display: true,
              position: "left"
            }
          ]
        }
      }
    });

    var ctx3 = document.getElementById("canvas3").getContext("2d");
    window.myBar = new Chart(ctx3, {
      type: "line",
      data: medianData,
      options: {
        responsive: true,

        title: {
          display: true,
          text: "Employement Comparison"
        },
        scales: {
          axisX: {
            lable: iMonths
          },

          yAxes: [
            {
              type: "linear", // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
              display: true,
              position: "left"
            }
          ]
        }
      }
    });

    var ctx4 = document.getElementById("canvas4").getContext("2d");
    window.myBar = new Chart(ctx4, {
      type: "line",
      data: comparisonData,
      options: {
        responsive: true,
        title: {
          display: true,
          text: "Student Loan Debt vs. Income"
        }
      }
    });
  };
