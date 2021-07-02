var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
// import mongoDB
var mongoose = require("mongoose");
var config = require("./database/mongodb");
var cors = require("cors");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

// Delivery man Module's router
var deliveryManRouter = require("./routes/deliveryman");

//Package and Delivery Module's router
var vehiculeRouter = require("./routes/vehicule");
var packageRouter = require("./routes/Package");
var deliveryRouter = require("./routes/delivery");

//Customer & Entreprise Module's routers
var customerRouter = require("./routes/customers");
var entrepriseRouter = require("./routes/entreprise");
var paymentRouter = require("./routes/payment");

//Users Router
var userRouter = require("./routes/users");

var app = express();
require("dotenv").config();
const bodyParser = require("body-parser");

// mongo config
mongoose
  .connect(config.mongo.uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to Mongo"))
  .catch((err) => console.log(err));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use("/public", express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/deliveryman", deliveryManRouter);

//Package & delivery Module's middlewares
app.use("/vehicle", vehiculeRouter);
app.use("/Package", packageRouter);
app.use("/delivery", deliveryRouter);

//Customer & Entreprise Module's middlewares
app.use("/customers", customerRouter);
app.use("/entreprises", entrepriseRouter);
app.use("/payments", paymentRouter);

//User middlewares
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});
module.exports = app;
