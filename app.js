const fs = require('fs');
const csv = require('fast-csv');
const domainOrderRaw = [];
const domainOrderCondensed = [];
const studentTests = [];
const studentTestsCondensed = [];
const studentPlans = [];


run();



function run() {
    const domainOrderCSV = fs.createReadStream("./csv/domain_order.csv");

    csv
        .fromStream(domainOrderCSV)
        .on("data", function (data) {
            domainOrderRaw.push(data);
        })
        .on("end", function () {
            console.log("domain_order.csv read successful");
            console.log(domainOrderRaw);
            const studentTestCSV = fs.createReadStream("./csv/student_tests.csv");

            csv
                .fromStream(studentTestCSV)
                .on("data", function (data) {
                    studentTests.push(data);
                })
                .on("end", function () {
                    console.log("domain_order.csv read successful");
                    console.log(studentTests);
                    createStudentPlans();
                });
        });
};

function createStudentPlans() {


    for (var i = 0; i < domainOrderRaw.length; i++) {
        for (var j = 1; j < domainOrderRaw[i].length; j++) {
            domainOrderCondensed.push(domainOrderRaw[i][0] + "." + domainOrderRaw[i][j]);
        };
    };
    console.log(domainOrderCondensed);


    for (var i = 1; i < studentTests.length; i++) {
        var newStudent = [];
        studentPlans.push([studentTests[i][0]]);

        for (var j = 1; j < studentTests[i].length; j++) {
            newStudent.push(studentTests[i][j] + "." + studentTests[0][j]);
        };

        studentTestsCondensed.push(newStudent);
    };
    console.log(studentTestsCondensed);


    for (var i = 0; i < domainOrderCondensed.length; i++) {
        for (var j = 0; j < studentTestsCondensed.length; j++) {
            if (studentTestsCondensed[j].includes(domainOrderCondensed[i])) {
                studentPlans[j].push(domainOrderCondensed[i]);
            }
        };
    };
    console.log(studentPlans);
    createStudentPlanCSV();
}

function createStudentPlanCSV() {
    var ws = fs.createWriteStream("./csv/student_plans.csv");
    csv
        .write(studentPlans, { headers: true })
        .pipe(ws);
}