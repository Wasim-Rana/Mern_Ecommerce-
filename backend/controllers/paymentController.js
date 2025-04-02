const catchAsyncErrors = require("../middleware/catchAsyncError");

const stripe = require("stripe")(process.env.STRIPE_SECRET);

exports.processPayment = catchAsyncErrors(async (req, res, next) => {

  console.log("Payment data received:", req.body); // Debug incoming request

  const myPayment = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: "inr",
    description: "Ecommers services",

    metadata: {
      company: "ShopNest",
    },
  });

  console.log("Stripe Payment Intent Created:", myPayment);
  res
    .status(200)
    .json({ success: true, client_secret: myPayment.client_secret });
});

exports.sendStripeApiKey = catchAsyncErrors(async (req, res, next) => {
  // console.log("Sending Stripe API Key:", process.env.STRIPE_API_KEY); // Add this to debug
  res.status(200).json({ stripeApiKey: process.env.STRIPE_API_KEY });
});
