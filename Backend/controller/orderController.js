const Orders = require("../model/orderModel");
const errorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const Products = require("../model/productModel");

//create new order
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

  const order = await Orders.create({
    paidAt: Date.now(),
    user: req.user._id,
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  });

  res.status(201).json({
    success: true,
    order,
  });
});

//get single order
exports.getSingleOrder = catchAsyncError(async (req, res, next) => {
  const order = await Orders.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (!order) {
    return next(
      new errorHandler(`Order not found with this Id: ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    order,
  });
});

//get logged in user orders
exports.myOrders = catchAsyncError(async (req, res, next) => {
  const orders = await Orders.find({ user: req.user._id });

  res.status(200).json({
    success: true,
    orders,
  });
});

//get all orders -- admin
exports.getAllOrders = catchAsyncError(async (req, res, next) => {
  const orders = await Orders.find();

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

//update order status -- admin
exports.updateOrderStatus = catchAsyncError(async (req, res, next) => {
  const order = await Orders.findById(req.params.id);
  if (!order) {
    return next(new errorHandler(`Order not found by id: ${req.params.id}`));
  }

  if (order.orderStatus === "delivered") {
    return next(new errorHandler("Order has already been delivered.", 400));
  }

  order.orderItems.forEach(async (order) => {
    await updateStock(order.product, order.quantity);
  });
  order.orderStatus = req.body.status;
  if (order.orderStatus === "delivered") {
    order.deliveredAt = Date.now();
  }

  await order.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
    order,
  });
});

async function updateStock(id, quantity) {
  const product = await Products.findById(id);
  product.stock -= quantity;
  await product.save({ validateBeforeSave: false });
}

//delete order -- admin
exports.deleteOrder = catchAsyncError(async (req, res, next) => {
  const order = await Orders.findById(req.params.id);

  if (!order) {
    return next(new errorHandler(`Order not found by id: ${req.params.id}`));
  }

  await order.deleteOne();

  res.status(200).json({
    success: true,
    order,
  });
});
