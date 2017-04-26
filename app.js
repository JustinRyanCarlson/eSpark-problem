const fs = require('fs');
// Fast-csv is a easy to use NPM package for parsing and creating .csv files
const csv = require('fast-csv');
const domainOrderRaw = [];
const domainOrderCondensed = [];
const studentTests = [];
const studentTestsCondensed = [];
const studentPlans = [];


// Function to start execution of the application
run();


// ==================== FUNCTIONS ==========================================================

// Function to parse the domain_order and student_tests csv files then call the
// createStudentPlans functions upon completion
function run() {
    const domainOrderCSV = fs.createReadStream("./csv/domain_order.csv");

    csv
        .fromStream(domainOrderCSV)
        .on("data", function (data) {
            domainOrderRaw.push(data);
        })
        .on("end", function () {
            console.log("domain_order.csv read successful");
            const studentTestCSV = fs.createReadStream("./csv/student_tests.csv");

            csv
                .fromStream(studentTestCSV)
                .on("data", function (data) {
                    studentTests.push(data);
                })
                .on("end", function () {
                    console.log("student_tests.csv read successful");
                    createStudentPlans();
                });
        });
};


// Function to create the student plans from the parsed csv data in the run function
function createStudentPlans() {
    // Loops thorugh each row in the domain_order csv and appends the subject to the current
    // grade level to get the data in GradeLevel.Subject format
    for (var i = 0; i < domainOrderRaw.length; i++) {
        for (var j = 1; j < domainOrderRaw[i].length; j++) {
            domainOrderCondensed.push(domainOrderRaw[i][0] + "." + domainOrderRaw[i][j]);
        };
    };

    // Creates a new array of arrays from the student_tests csv so that the new format of
    // data is GradeLevel.Subject to match the domainOrderCondensed array
    for (var i = 1; i < studentTests.length; i++) {
        var newStudent = [];
        studentPlans.push([studentTests[i][0]]);

        for (var j = 1; j < studentTests[i].length; j++) {
            newStudent.push(studentTests[i][j] + "." + studentTests[0][j]);
        };

        studentTestsCondensed.push(newStudent);
    };

    // Checks to see if the current index value for the plan sequence (domainOrderCondensed)
    // exists in a students tested level, if it does it pushs that value into that students array
    for (var i = 0; i < domainOrderCondensed.length; i++) {
        for (var j = 0; j < studentTestsCondensed.length; j++) {
            if (studentTestsCondensed[j].includes(domainOrderCondensed[i])) {
                studentPlans[j].push(domainOrderCondensed[i]);
            }
        };
    };


    createStudentPlanCSV();
};

// Function to create the student learning plans as a .csv file stored as
// student_plans.csv under the ./csv/ directory
function createStudentPlanCSV() {
    var ws = fs.createWriteStream("./csv/student_plans.csv");
    csv
        .write(studentPlans, { headers: true })
        .pipe(ws)
        .on("finish", function () {
            console.log("\n" + "student_plans.csv created successfully!" + "\n");
        });
};