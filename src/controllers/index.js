const {
	forgetPassword,
	loginUser,
	registerUser,
	verifyOtp,
} = require("./auth.controller");

module.exports = {
	AuthController: {
		loginUser,
		registerUser,
		forgetPassword,
		verifyOtp,
	},
};
