const httpStatus = require("http-status");
const bcrypt = require("bcrypt");
const shortid = require("shortid");
const ApiError = require("../utils/ApiError");

const UserQueries = require("../models/user.model");
const TokenQueries = require("../models/token.model");
const config = require("../config/config");
const { sendMail } = require("../utils/SendEmail");

// check password
const comparePassword = async (plainTextPassword, hash) => {
	const result = await bcrypt.compare(plainTextPassword, hash);

	return result;
};

// hash password
const hashPassword = async (plainTextPassword) => {
	const hash = await bcrypt.hash(plainTextPassword, 10);

	return hash;
};

// generate jwt token for authentication
const genToken = async ({ ...details }) => {
	return jwt.sign({ ...details }, config.jwt.secret, {
		expiresIn: "30d",
	});
};

// generate OTP for any type of extra validation
const genOTP = async () => {
	return shortid.generate();
};

// generate new Date based on time
const genDate = (minutes) => {
	var minutesToAdd = minutes;
	var currentDate = new Date();
	var futureDate = new Date(currentDate.getTime() + minutesToAdd * 60000);

	return futureDate;
};

// login user
const loginUser = async (email, password) => {
	const userInDb = await UserQueries.findOne({
		email,
	});

	if (!userInDb) {
		throw new ApiError(httpStatus.UNAUTHORIZED, "User doesn't exist");
	}

	if (!comparePassword(password, userInDb.password)) {
		throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect password");
	}

	const { _id, name, isVerified } = userInDb;

	if (isVerified === false) {
		const OTP = await genOTP();
		const existingOTPForEmailVerification = await TokenQueries.findOne({
			user_id: _id,
			token_type: "EMAIL_VERIFY",
		});

		if (!existingOTPForEmailVerification) {
			await TokenQueries.create({
				user_id: _id,
				token: OTP,
				token_type: "EMAIL_VERIFY",
				expiresIn: genDate(15),
			});
		} else {
			// update that one only
			existingOTPForEmailVerification.token = OTP;
			existingOTPForEmailVerification.expiresIn = genDate(15);
			await TokenQueries.findByIdAndUpdate(
				existingOTPForEmailVerification._id,
				{
					token: OTP,
					expiresIn: genDate(15),
				}
			);
		}

		// send mail
		await sendMail({
			name,
			email,
			subject: "OTP for email verification",
			html: `<h1>OTP ${OTP}</h1>`,
		});
	}

	// gen token and send token

	const existingAccessToken = await TokenQueries.findOne({
		user_id: _id,
		token_type: "ACCESS",
	});

	const Token = await genToken({ _id, email, name });
	if (!existingAccessToken) {
		// create new and send it
		await TokenQueries.create({
			user_id: _id,
			token: Token,
			expiresIn: genDate(30 * 24 * 60),
			token_type: "ACCESS",
		});
	} else {
		// update and send it
		await TokenQueries.findByIdAndUpdate(existingAccessToken._id, {
			token: Token,
			expiresIn: genDate(30 * 24 * 60),
		});
	}

	return Token;
};

// register user
const registerUser = async (email, password, name) => {
	const userInDb = await UserQueries.findOne({ email });

	if (userInDb) {
		throw new ApiError(httpStatus.UNAUTHORIZED, "User already exists");
	}

	// first hash password
	const hash = await hashPassword(password);
	// then create user
	const newUserInDb = await UserQueries.create({
		email,
		name,
		password: hash,
	});
	// then send otp for verification and also create in db
	const OTP = await genOTP();
	await TokenQueries.create({
		token: OTP,
		token_type: "EMAIL_VERIFY",
		user_id: newUserInDb._id,
		expiresIn: genDate(15),
	});
	// send that in mail
	sendMail({
		name,
		email,
		subject: "OTP for email verification",
		html: `<h1>OTP : ${OTP}</h1>`,
	});
	// that's all
};

// generate token for forgetPassword and isVerified and also sent in mail

// do otp verification
const verifyOtp = async (otp, otpType, user_id) => {
	const tokenInDb = await TokenQueries.findOne({
		user_id: user_id,
		token_type: otpType,
	});

	if (!tokenInDb) {
		throw new ApiError(httpStatus.NOT_FOUND, "No such token found");
	}

	if (otpType === "EMAIL_VERIFY" && otp === tokenInDb.token) {
		await UserQueries.findByIdAndUpdate(user_id, {
			isVerified: true,
		});
		await TokenQueries.findByIdAndDelete(tokenInDb._id);
	} else if (otpType === "FORGET_PASSWORD") {
		// implement it tomorrow
	} else {
		throw new ApiError(
			httpStatus.UNAUTHORIZED,
			"Not authorized for further actions"
		);
	}
};

module.exports = {
	loginUser,
	registerUser,
	verifyOtp,
};
