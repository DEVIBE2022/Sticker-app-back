const { loginUser, registerUser, verifyOtp } = require("./auth.service");

module.exports = {
	AuthServices: {
		loginUser,
		registerUser,
		verifyOtp,
	},
};
