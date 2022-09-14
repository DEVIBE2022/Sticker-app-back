const mongoose = require("mongoose");

const TokenSchema = new mongoose.Schema(
	{
		user_id: {
			type: String,
			required: true,
		},
		token_type: {
			type: String,
			enum: ["ACCESS", "EMAIL_VERIFY", "FORGET_PASSWORD"],
		},
		token: {
			type: String,
			required: true,
		},
		expiresIn: {
			type: Date,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Tokens", TokenSchema);
