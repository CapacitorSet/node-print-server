// Usage: node print.js <file>

var printer = require("printer"),
	fs      = require("fs");

console.log("Printing", process.argv[2]);

printer.printDirect(
	{
		data: fs.readFileSync(process.argv[2]),
		//printer:'Foxit Reader PDF Printer', // printer name, if missing then will print to default printer
		type: 'AUTO', // type: RAW, TEXT, PDF, JPEG, .. depends on platform
		success: function(jobID){
			console.log("Job sent to printer with ID", jobID);
		},
		error:function(err) {
			console.log(err);
		}
	}
);