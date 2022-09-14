const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { AuthServices } = require("../services");

const loginUser = catchAsync(async (req, res, next) => {
	const { email, password } = req.body;

	// login user
	const loginUserSuccess = await AuthServices.loginUser(email, password);

	return res.status(httpStatus.FOUND).json({
		code: httpStatus.FOUND,
		status: httpStatus[httpStatus.FOUND],
		message: "User found and logged in",
		data: loginUserSuccess,
	});
});

const registerUser = catchAsync(async (req, res, next) => {
	const { email, password, name } = req.body;

	// register user
	await AuthServices.registerUser(email, password, name);

	return res.status(httpStatus.CREATED).json({
		code: httpStatus.CREATED,
		status: httpStatus[httpStatus.CREATED],
		message: "User registered successfully",
		data: null,
	});
});

const forgetPassword = catchAsync(async (req, res, next) => {
	const { email } = req.body;

	// make token and send email

	return res.status(httpStatus.OK).json({
		code: httpStatus.OK,
		status: httpStatus[httpStatus.OK],
		message: "Sent otp",
		data: null,
	});
});

const verifyOtp = catchAsync(async (req, res, next) => {
	const { otp, otpType, user_id } = req.body;

	// verify the otp
	await AuthServices.verifyOtp(otp, otpType, user_id);

	return res.status(httpStatus.OK).json({
		code: httpStatus.OK,
		status: httpStatus[httpStatus.OK],
		message: "Verified otp",
		data: null,
	});
});

module.exports = {
	loginUser,
	registerUser,
	forgetPassword,
	verifyOtp,
};
