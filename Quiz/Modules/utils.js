var _ = require('underscore');
var sanitizer = require('sanitizer');
var mailMod = require('waf-mail/mail');
var config = require('config').mail;
var sConf = config.sender;
var rConf = config.report;

exports.sendResponse = function(session) {
	var report = exports.getReport(session);
	var mail = new mailMod.Mail();

	mail.from = rConf.from;
	mail.to = rConf.to;
	mail.cc = rConf.cc;
	mail.bcc = rConf.bcc;
	mail.subject = "[Report][" + session.exam.title + "] User: " + session.user;
	mail.setBodyAsHTML(report);
	
	var res = mail.send(sConf.address, sConf.port, sConf.isSSL, sConf.username, sConf.password);
	
	session.report_sent = res.isOk;
	session.save();

	return res;
};

exports.getReport = function(session) {
	var file = File(getFolder(), rConf.template);
	var comp = _.template(file.toString());

	return comp({
		session: session,
		sanitizer: sanitizer,
		formatTime: function(ms) {
			function pad(nb) {
				var str = nb + '';
				while (str.length < 2) {
					str = '0' + str;
				}
				return str;
			}

			var s = Math.floor(ms / 1000);

			// Minutes
			var m = Math.floor(s / 60);
			s -= m * 60;

			// Hours
			var h = Math.floor(m / 60);
			m -= h * 60;

			// Days
			var days = Math.floor(h / 24);
			h -= h * 24;

			timeString = pad(h) + ':' + pad(m) + ':' + pad(s);

			if (days > 0) timeString += (days > 1) ? (days + " days ") : (days + " day ");

			return timeString;
		},
		formatResponse: function(r) {
			var str = 'No response!';

			if (!r) {
				return str;
			}

			switch (r.getDataClass().getName()) {
				case 'Question':
					switch (r.type) {
						case 'Q':
							var options = JSON.parse(r.options);
							var response = parseInt(r.response);

							return options[response];
						case 'M':
							var options = JSON.parse(r.options);
							var response = JSON.parse(r.response);
							var result = '';

							response.forEach(function(r) {
								result += options[r] + '<br/>';
							});

							return result;
						case 'T':
							return r.response === true ? 'True' : 'False';
						case 'G':
							return '';
					}
					break;
				case 'Response':
					var response = JSON.parse(r.response);
					var q = r.question;

					switch (q.type) {
						case 'Q':
							var options = JSON.parse(q.options);
							return options[response];
						case 'M':
							var options = JSON.parse(r.options);
							var result = '';

							response.forEach(function(r) {
								result += options[r] + '<br/>';
							});

							return result;
						case 'T':
							return response === true ? 'True' : 'False';
						case 'G':
							return response;
					}
					break;
			}

			return str;
		}
	});
};