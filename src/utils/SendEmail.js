const nodemailer = require("nodemailer");
const config = require("../config/config");

const sender = nodemailer.createTransport({
	service: "gmail",
	secureConnection: true,
	logger: true,
	auth: {
		user: config.nodemailer.email,
		pass: config.nodemailer.password,
	},
});

const sendMail = ({ name, email, subject, html }) => {
	const mail = {
		from: `Devibe Test Account ${config.nodemailer.email}`,
		to: email,
		subject: subject,
		html: `${html}`,
	};

	sender.sendMail(mail, function (err, info) {
		if (err) {
			console.log(`There was an error sending email ---> ${err}`);
		} else {
			console.log(`Successfully sent email ---> ${info.response}`);
		}
	});
};

module.exports = {
	sendMail,
};
