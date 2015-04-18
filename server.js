var express = require('express');
var app = express();

app.get("/", function(req, res) {
	res.send("Main page");
})

app.get("*", function(req, res) {
	res.redirect("/");
})

app.listen(8080);