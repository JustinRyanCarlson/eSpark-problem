var fs = require('fs');
var csv = require('fast-csv');


var arr = [];

var stream = fs.createReadStream("./csv/domain_order.csv");

csv
    .fromStream(stream)
    .on("data", function (data) {
        arr.push(data);
    })
    .on("end", function () {
        console.log("done");
        console.log(arr[1]);
    });