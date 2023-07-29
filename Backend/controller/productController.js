const Products = require("../model/productModel");
const errorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const apiFeatures = require("../utils/apiFeatures");

//create product -- admin
exports.createProduct = catchAsyncError(async (req, res, next) => {
  req.body.user = req.user.id;
  const product = await Products.create(req.body);
  res.status(201).json({ success: true, product });
});

//get all products
exports.getAllProducts = catchAsyncError(async (req, res, next) => {
  const resultPerPage = 5;
  const productsCount = await Products.countDocuments();

  const apiFeature = new apiFeatures(Products.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);
  const products = await apiFeature.query;
  res.status(200).json({ success: true, productsCount, products });
});

//get product details
exports.getProductDetails = catchAsyncError(async (req, res, next) => {
  let product = await Products.findById(req.params.id);
  if (!product) {
    return next(new errorHandler("Product not found", 404));
  }
  res.status(200).json({ success: true, product });
});

//update product -- admin
exports.updateProduct = catchAsyncError(async (req, res, next) => {
  let product = await Products.findById(req.params.id);
  if (!product) {
    return next(new errorHandler("Product not found", 404));
  }
  product = await Products.findByIdAndUpdate({ _id: req.params.id }, req.body);
  res.status(200).json({ success: true, product });
});

//delete product -- admin
exports.deleteProduct = catchAsyncError(async (req, res, next) => {
  let product = await Products.findById(req.params.id);
  if (!product) {
    return next(new errorHandler("Product not found", 404));
  }
  product = await Products.findByIdAndRemove({ _id: req.params.id });
  res.status(200).json({ success: true, product });
});
