const Order = require("../models/orderModel");
const Product = require("../models/productModel");

const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError = require("../middleware/catchAsyncError");

//creating new order
exports.newOrder = catchAsyncError(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;
  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });
  res.status(200).json({
    success: true,
    order,
  });
});

// get single order details

exports.getSingleOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (!order) {
    return next(new ErrorHandler("Order not found", 404));
  }
  res.status(202).json({
    success: true,
    order,
  });
});

// get all orders of by user

exports.myOrders = catchAsyncError(async (req, res, next) => {
  const order = await Order.find({ user: req.user._id });
  if (!order) {
    return next(new ErrorHandler("You dont have any orders", 404));
  }
  res.status(202).json({
    success: true,
    order,
  });
});

// get all orders --admin
exports.getAllOrders = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find();
  if (!orders) {
    return next(new ErrorHandler("You dont have any orders", 404));
  }
  let totalAmount = 0;

  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });
  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});

// update order status
exports.updateOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ErrorHandler("You dont have any orders", 404));
  }
  if (order.orderStatus === "Delivered") {
    return next(new ErrorHandler("Order already delivered", 400));
  }
  if (req.body.status === "Shipped") {
    order.orderItems.forEach(async (order) => {
      await updateStock(order.product, order.quantity);
    });
  }
  order.orderStatus = req.body.status;
  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }
  order.save({ validateBeforeSave: true });
  res.status(200).json({
    success: true,
  });
});

async function updateStock(id, quantity) {
  const product = await Product.findById(id);
  product.stock -= quantity;
  await product.save({ validateBeforeSave: true });
}

// delete order
exports.deleteOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ErrorHandler("You dont have any orders", 404));
  }

  await order.deleteOne();
  res.status(200).json({
    success: true,
  });
});
