const express = require("express");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const cors = require("cors");
const httpStatus = require("http-status");
const config = require("./config/config");
const morgan = require("./config/morgan");

const { errorConverter, errorHandler } = require("./middlewares/error");
const ApiError = require("./utils/ApiError");

const app = express();

if (config.env !== "test") {
	app.use(morgan.successHandler);
	app.use(morgan.errorHandler);
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(xss());
app.use(mongoSanitize());

// app.use(cors());
// app.options("*", cors());
// app.use((_, res, next) => {
// 	res.setHeader("Access-Control-Allow-Origin", "*");
// 	res.setHeader(
// 		"Access-Control-Allow-Methods",
// 		"GET, POST, PUT, PATCH, DELETE"
// 	);
// 	res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
// 	next();
// });

// res.header( "Access-Control-Allow-Origin" );
app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Methods",
		"GET, POST, OPTIONS, PUT, PATCH, DELETE"
	);
	res.header(
		"Access-Control-Allow-Headers",
		"x-access-token, Origin, X-Requested-With, Content-Type, Accept"
	);
	next();
});

// welcome routes
app.get("/", async (req, res) => {
	return res.status(200).json({ message: "Welcome to sticker app backend" });
});

// routes
require("./routes")(app);

// handling invalid requests
app.use((req, res, next) => {
	next(new ApiError(httpStatus.NOT_FOUND, "Not Found"));
});

app.use(errorConverter);
app.use(errorHandler);

module.exports = app;
