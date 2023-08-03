const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
  createProductReview,
  getProductReviews,
  deleteReview,
} = require("../controller/productController");
const { isAuthenticatedUser, userRole } = require("../middleware/auth");

const router = express.Router();

router.route("/products").get(getAllProducts);
router
  .route("/admin/products/addNewProduct")
  .post(isAuthenticatedUser, userRole("admin"), createProduct);
router
  .route("/admin/products/:id")
  .put(isAuthenticatedUser, userRole("admin"), updateProduct)
  .delete(isAuthenticatedUser, userRole("admin"), deleteProduct);

router.route("/products/:id").get(getProductDetails);

router
  .route("/review")
  .put(isAuthenticatedUser, createProductReview)
  .get(getProductReviews)
  .delete(isAuthenticatedUser, deleteReview);

module.exports = router;
