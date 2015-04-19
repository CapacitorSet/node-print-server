quotas = {
	admin: 50
}

module.exports = {
	authenticate: function(username, password) {
		return (username == "admin" && password == "admin");
	}
}