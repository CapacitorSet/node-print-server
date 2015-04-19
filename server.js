var express = require("express"),
app     = express(),
uuid    = require("node-uuid"),
auth    = require("basic-auth"),
session = require("express-session"),
busboy  = require("connect-busboy"),
path    = require("path"),
os      = require("os"),
fs      = require("fs"),
setup   = require("./setup.js");

app.set('view engine', 'ejs');

app.use(busboy({
	highWaterMark: setup.uploadSizeLimit,
	limits: {
		fileSize: setup.uploadSizeLimit,
		files: 1
	}
}));

app.use(session({
	resave: false,
	saveUninitialized: false,
	secret: uuid.v4(),
}));

app.use(function(req, res, next) {
	var credentials = auth(req);

	/* If no credentials were provided, reject the request (this is needed for first-time hits).
	 * If the external auth method reports false, reject the request.
	 */
	 if (!credentials || setup.authenticate(credentials.name, credentials.pass) == false) {
	 	res.writeHead(401, {
	 		'WWW-Authenticate': 'Basic realm="Node.js printing server"'
	 	})
	 	res.end("Authentication failed! Please refresh the page and enter your data.");
	 	next("Authentication failed!");
	 } else {
		// Else, log in and store username.
		req.session.username = credentials.name;
		next();
	}
});

app.get("/", function(req, res) {
	// Should make the size human-readable
	res.render("index", { maxSize: setup.uploadSizeLimit + " bytes" });
});

app.post("/print", function(req, res) {
	if (req.busboy) {
		destination = 
		req.busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
			setup.attemptUpload({
				username: req.session.username,
				filesize: file.length,
				filename: filename,
				mimetype: mimetype,
				req: req,
				res: res
			}, function(errMsg) {
				if (errMsg) {
					res.end(errMsg);
				} else {
					console.log("Saving to", destination);
    				file.pipe(fs.createWriteStream(destination));
				}
			});
		});
		req.busboy.on("finish", function() {
			res.end("File received!");
		});
		req.pipe(req.busboy);
	} else {
		res.end("req.busboy didn't work!");
	}
});

app.use("*", function(req, res) {
	res.redirect("/");
});

app.listen(8080);