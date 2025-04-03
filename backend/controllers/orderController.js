const Order = require("../models/orderModel");
const Product = require("../models/productModel");

const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError = require("../middleware/catchAsyncError");

// Creating a new order
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

  // Ensure orderItems exist
  if (!orderItems || orderItems.length === 0) {
    return next(new ErrorHandler("No order items provided", 400));
  }

  // Ensure user is logged in
  if (!req.user || !req.user._id) {
    return next(new ErrorHandler("User not authenticated", 401));
  }

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

  res.status(201).json({
    success: true,
    order,
  });
});

// Get single order details
exports.getSingleOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate("user", "name email");

  if (!order) {
    return next(new ErrorHandler("Order not found", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// Get all orders of a user
exports.myOrders = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });

  res.status(200).json({
    success: true,
    orders,
  });
});

// Get all orders (Admin)
exports.getAllOrders = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find();

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

// Update order status
exports.updateOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found", 404));
  }

  if (order.orderStatus === "Delivered") {
    return next(new ErrorHandler("Order already delivered", 400));
  }

  if (req.body.status === "Shipped") {
    for (const orderItem of order.orderItems) {
      await updateStock(orderItem.product, orderItem.quantity);
    }
  }

  order.orderStatus = req.body.status;

  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }

  await order.save({ validateBeforeSave: true });

  res.status(200).json({
    success: true,
  });
});

// Function to update product stock
async function updateStock(productId, quantity) {
  const product = await Product.findById(productId);
  if (!product) {
    throw new ErrorHandler("Product not found", 404);
  }
  product.stock -= quantity;
  await product.save({ validateBeforeSave: true });
}

// Delete an order
exports.deleteOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found", 404));
  }

  await order.deleteOne();

  res.status(200).json({
    success: true,
    message: "Order deleted successfully",
  });
});
