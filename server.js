var express = require("express"),
	app     = express(),
	auth    = require("basic-auth"),
	session = require("express-session"),
	setup   = require("./setup.js");
 
var cookie_secret = Math.random();

app.set('view engine', 'ejs');

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
		// Else, log in.
		next();
	}
});

app.use(session({
	resave: false,
	saveUninitialized: false,
	secret: cookie_secret,
}));

app.get("/", function(req, res) {
	res.render("index");
})

app.get("*", function(req, res) {
	res.redirect("/");
})

app.listen(8080);