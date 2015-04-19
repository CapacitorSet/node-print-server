quotas = {
	admin: 50
}

module.exports = {
	attemptUpload: function(upload, callback) {
		if (quotas[upload.username] > 0) {
			quotas[upload.username]--;
			callback(null);
		} else {
			callback("You're not authorized to print this!");
		}
	},
	authenticate: function(username, password) {
		return (username == "admin" && password == "admin");
	},
	uploadSizeLimit: 5*1024*1024
}