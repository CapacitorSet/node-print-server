var express = require("express"),
	app     = express(),
	basicAuth = require('basic-auth-connect');

app.set('view engine', 'ejs'); 
app.use(basicAuth(function(user, pass, callback) {
	var result = (user === 'testUser' && pass === 'testPass');
	callback(null /* error */, {user: user, pass: pass});
}));

app.get("/", function(req, res) {
	res.render("index");
})

app.get("*", function(req, res) {
	res.redirect("/");
})

app.listen(8080);