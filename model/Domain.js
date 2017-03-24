var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Domain = new Schema({
	domain: {
		type: String,
		unique: true
	},
	email: {
		type: String
	},
	canPing: {
		type: Boolean
	}
});

module.exports = mongoose.model("monitor", Domain);