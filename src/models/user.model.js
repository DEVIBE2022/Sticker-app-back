const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Please provide name"],
		},
		email: {
			type: String,
			required: [true, "Please provide email"],
		},
		password: {
			type: String,
			required: [true, "Please provide password"],
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Users", UserSchema);
