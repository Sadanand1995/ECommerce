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

//create new review or update the review
exports.createProductReview = catchAsyncError(async (req, res, next) => {
  const { rating, comment, productId } = req.body;
  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };
  const product = await Products.findById(productId);

  const isReviewed = product.reviews.find(
    (rev) => rev.user._id.toString() === req.user._id.toString()
  );
  if (!isReviewed === false) {
    product.reviews.forEach((rev) => {
      if (rev.user._id.toString() === req.user._id.toString()) {
        rev.rating = rating;
        rev.comment = comment;
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  let tRating = 0;
  product.reviews.forEach((rev) => {
    tRating += rev.rating;
  });
  product.ratings = tRating / product.reviews.length;
  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    product,
  });
});

//get all reviews of a product
exports.getProductReviews = catchAsyncError(async (req, res, next) => {
  const product = await Products.findById(req.query.id);
  if (!product) {
    return next(new errorHandler("Product not found", 404));
  }
  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

//delete review
exports.deleteReview = catchAsyncError(async (req, res, next) => {
  const product = await Products.findById(req.query.productId);
  if (!product) {
    return next(new errorHandler("Product not found", 404));
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.reviewId.toString()
  );

  let tRating = 0;
  reviews.forEach((rev) => {
    tRating += rev.rating;
  });
  const ratings = tRating / reviews.length;
  const numOfReviews = reviews.length;

  await Products.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      numOfReviews,
      ratings,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});
