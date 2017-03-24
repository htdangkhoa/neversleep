var config = require("./config"),
	bodyParser = require("body-parser"),
	cors = require("cors"),
	ejs = require("ejs"),
	mongoose = require("mongoose"),
	express = require("express");

var port =  process.env["PORT"] || 5000;

mongoose.connect(config.database);

var app = express();
app.use(express.static(__dirname + "/"));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.engine("html", ejs.renderFile);

module.exports.router = express.Router();

app.use("/", require("./routes/ping"));

var server = app.listen(port, function(){
	console.log("Connected.")
});

server.timeout = 300000;