var express = require("express"),
	app     = express(),
	auth    = require("basic-auth"),
	session = require("express-session");
 
app.set('view engine', 'ejs'); 
app.use(function(req, res, next) {
	var credentials = auth(req);
	// If no credentials were provided, reject the request (this is needed for first-time hits).
	if (!credentials) {
		res.writeHead(401, {
			'WWW-Authenticate': 'Basic realm="Node.js printing server"'
		})
	    res.end("Authentication failed! Please refresh the page and enter your data.");
	    next("Authentication failed!");
	}
	// Else, continue processing the request, no matter what credentials were sent.
	next();
});

app.use(session({
	resave: false,
	saveUninitialized: false,
	secret: "Insert secret here"
}));

app.get("/", function(req, res) {
	res.render("index");
})

app.get("*", function(req, res) {
	res.redirect("/");
})

app.listen(8080);