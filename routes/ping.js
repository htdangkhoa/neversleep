var router = require("../server").router;
var path = require("path");
var isUrl = require("is-url");
var isEmail = require("is-email");
var curl = require("curl");

//Config nodemailer
var nodemailer = require("nodemailer");
var transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: <email>,
		pass: <password>
	}
});

//Setup schema for mongoDB.
var Domains = require("../model/Domain.js");
Domains.find({})
.then(function(urls) {
	if (urls.length === 0) {
		var Domain = new Domains({
			domain: "https://neversleep.herokuapp.com/",
			email: "huynhtran.dangkhoa@gmail.com",
			canPing: true
		}).save(function(err, result) {
			if (err) return console.log(err);

			return console.log(result);
		});
	}

	pingDomains();
}, function(error) {
	console.log(error);
});

var ping;
initInterval();

router.get("/", function(req, res) {
	Domains.find({})
	.then(function(domains) {
		return res.render("home.html", { sum: domains.length });
	}, function(error) {
		return res.send(error);
	});
});

router.post("/monitoring", function(req, res, next) {
	var domain = req.body.domain;
	var email = req.body.email;

	var check = false;

	if (!domain || !email) {
		return res.status(400).send("Bad request.");
	}

	if (!isUrl(domain)) {
		return res.status(400).send("The domain is incorrect.");
	}

	if (!isEmail(email)) {
		return res.status(400).send("The email is incorrect.");
	}

	new Domains({
		domain: domain,
		email: email,
		canPing: true
	}).save(function(error, result) {
		Domains.find({})
		.then(function(domains) {
			if (error) return res.status(200).send({
				msg: "\"" + domain + "\"" + " already exists.",
				sum: domains.length
			});

			pingDomains();

			return res.status(200).send({
				msg: "\"" + domain + "\"" + " is being monitored.",
				sum: domains.length
			});
		}, function(error) {
			return res.send(error);
		});
	});
});

router.post("/stop", function(req, res) {
	var domain = req.body.domain;

	if (!domain) {
		return res.status(400).send("Bad request.");
	}

	if (!isUrl(domain)) {
		return res.status(400).send("The domain is incorrect.");
	}

	Domains.find({
		domain: domain
	})
	.then(function(results) {
		if (results.length > 0) {
			results[0].remove();
		}

		Domains.find({})
		.then(function(domains) {
			if (results.length > 0) {
				return res.status(200).send({
					msg: "\"" + domain + "\"" + " has been deleted.",
					sum: domains.length
				});
			}

			return res.status(200).send({
				msg: "\"" + domain + "\"" + " does not exist.",
				sum: domains.length
			});
		}, function(error) {
			return res.send(error);
		});
	}, function(error) {
		return res.send(error);
	});
});

function initInterval(domain) {
	//After 25 minutes, system will ping to keep your server nerver sleep.
	clearInterval(ping);
	ping = setInterval(function() {
		pingDomains();
	}, 1500000);
}

function pingDomains() {
	Domains.find({})
	.then(function(domains) {
		domains.forEach(function(domain) {
			curl.get(domain["domain"], {
				timeout: 300000
			}, function(error, response, body) {
				if ((parseInt((response.statusCode/100)) == 4) || (parseInt((response.statusCode/100)) == 5)) {
					if (domain["canPing"]) {
						var time = new Date();

						transporter.sendMail({
							from: "Neversleep <teddyscript7896@gmail.com>",
							to: domain["email"],
							subject: "",
							html: '<!DOCTYPE html><html><head></head><body><h2>Problem with your domain.</h2><p><span style="font-size: 12pt;">Hi there.</span></p><p><span style="font-size: 12pt;">Today ' + time.toLocaleString().replace(",", "") +', it looks like your domain: "' + domain["domain"] + '" is having a problem.</span></p><p><span style="font-size: 12pt;">If possible, please check again and come back to us.</span></p><p><br /><span style="font-size: 10pt;">Thank you for using our service.</span></p></body></html>'
						}, function(err, info) {
							if (err) return console.log(err);

							domain["canPing"] = false;
							domain.save();
							return console.log(info);
						});
					}
				}
			});
		});
	}, function(error) {
		return console.log(error);
	});
}

module.exports = router;
