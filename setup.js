quotas = {
	admin: 50
}

module.exports = {
	authenticate: function(username, password) {
		return (username == "admin" && password == "admin");
	},
	uploadFileSizeLimit: 5*1024*1024
}