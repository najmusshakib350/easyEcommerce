//import node package
const path = require("path");
//import npm package
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const bodyParser = require("body-parser");
//import custom package
const categoryRouter = require("./router/categoryRouter");
const userRouter = require("./router/userRouter");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errControllers");
const reviewRouter = require("./router/reviewRouter");
const productRouter = require("./router/productRouter");
const cartRouter = require("./router/cartRouter");
const profileRouter = require("./router/profileRouter");
const paymentRouter = require("./router/paymentRouter");
const { webhookCheckout } = require("./controllers/paymentControllers");

const app = express();

//Stripe webhook url
// app.post('/webhook-checkout', app.use(express.raw()),bookingController.webhookCheckout);
app.post(
  "/webhook-checkout",
  bodyParser.raw({ type: "application/json" }),
  webhookCheckout
);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//Solv cross origin policy problem
app.use(cors());
//Router mount
app.use("/api/category/", categoryRouter);
app.use("/api/user/", userRouter);
app.use("/api/product", productRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/cart/", cartRouter);
app.use("/api/profile", profileRouter);
app.use("/api/payment/", paymentRouter);

//Handling Unhandled Routes
app.all("*", (req, res, next) => {
  return next(
    new AppError(`Can not find ${req.originalUrl} on this server`, 404)
  );
});
//global error handling middleware
app.use(globalErrorHandler);
module.exports = app;
