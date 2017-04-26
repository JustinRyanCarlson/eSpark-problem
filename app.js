const fs = require('fs');
const csv = require('fast-csv');
const domainOrder = [];
const studentTests = [];


readCSVs();


function readCSVs() {
    const domainOrderCSV = fs.createReadStream("./csv/domain_order.csv");

    csv
        .fromStream(domainOrderCSV)
        .on("data", function (data) {
            domainOrder.push(data);
        })
        .on("end", function () {
            console.log("domain_order.csv read successful");
            console.log(domainOrder);
            const studentTestCSV = fs.createReadStream("./csv/student_tests.csv");

            csv
                .fromStream(studentTestCSV)
                .on("data", function (data) {
                    studentTests.push(data);
                })
                .on("end", function () {
                    console.log("domain_order.csv read successful");
                    console.log(studentTests);
                });
        });
}